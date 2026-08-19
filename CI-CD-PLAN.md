# CI/CD Plan — user-crud-service

## Goal

A production-grade GitHub Actions pipeline that builds, lints, and tests
every push/PR to `main`/`develop`, with a secrets/config strategy that
scales as the project grows and eventually supports a deploy stage.

## Current state

Workflow: [.github/workflows/ci.yml](.github/workflows/ci.yml)

Three independent jobs, each its own status check:

| Job     | Runs                          | Depends on |
|---------|--------------------------------|------------|
| `build` | `npm ci` → `npm run build`     | —          |
| `lint`  | `npm ci` → `npm run lint`      | —          |
| `test`  | `npm ci` → wait for MySQL → `npm test` | `build`, `lint` |

`build` and `lint` run in parallel for fast feedback. `test` only starts
once both pass, so a broken build/lint never wastes time spinning up the
MySQL service container.

**Open issue:** `npm run lint` will fail right now — ESLint isn't
installed in this repo yet (no `eslint` devDependency, no config file).
Out of scope for this plan per prior discussion; flagged here so it isn't
forgotten before this pipeline is relied on.

## 1. Env var / secrets strategy — GitHub Environments

Inline `env:` blocks don't scale once there are more than a handful of
variables, or once `staging`/`production` deploy jobs need their own
overlapping-but-different values.

**Plan:** create GitHub Environments (repo Settings → Environments) and
have jobs opt in via `environment: <name>`:

- `test` — used by the CI `test` job. Holds:
  - **Variables** (non-sensitive): `DB_HOST`, `DB_NAME`, `DB_DIALECT`,
    `DB_SYNCHRONIZE`, `NODE_ENV`
  - **Secrets**: `DB_USERNAME`, `DB_PASSWORD` (mapped from the MySQL
    service's `MYSQL_USER`/`MYSQL_PASSWORD`)
- `production` (created later, once a deploy job exists) — its own
  variables/secrets, with a required reviewer/approval gate before the
  job can run.

Jobs reference these as `${{ vars.X }}` / `${{ secrets.X }}` instead of
repeating a growing list inline. Adding a new env var means adding it to
the Environment once, not editing every job that needs it.

**Action items:**
- [ ] Create `test` environment in repo settings, populate variables +
      secrets listed above
- [ ] Update `ci.yml` `test` job to use `environment: test` and drop the
      inline `env:` block
- [ ] When a deploy stage is added, create a `production` environment
      with required reviewers before secrets are released to the job

## 2. Secrets safety

GitHub Secrets are the right tool here, not a compromise:

- Encrypted at rest, decrypted only inside the runner for the job that
  references them
- Write-only after creation — nobody can read the value back via UI/API
- Workflow logs are auto-scanned and any matching secret value is
  redacted, even if a step accidentally prints it
- Environment-level secrets can require manual approval before release
  (useful once a `production` environment exists)

**Rules to keep following:**
- Never put secrets in `services.*.options` — GitHub does not expand
  `${{ secrets.* }}` there (this bit us already; fixed by dropping
  `-u`/`-p` from the MySQL health-check command)
- Only pass secrets through `env:` / `with:` / `environment` — never
  bake them into a Docker image layer or `run:` echo output
- For future cloud-deploy credentials, prefer OIDC federation over
  long-lived secrets where the target platform supports it

## 3. MySQL user privileges (CREATE DATABASE)

The app itself runs `CREATE DATABASE IF NOT EXISTS` on startup using its
own configured user — see
[database.utils.ts](src/database/database.utils.ts#L11) and
[database.connector.sequelize.ts](src/database/sql/sequelize/database.connector.sequelize.ts#L22).
It does **not** use root.

This already works correctly in CI because the `mysql:8` service sets
`MYSQL_DATABASE: test_db` alongside `MYSQL_USER`/`MYSQL_PASSWORD` — the
official image's entrypoint pre-creates `test_db` and grants that user
`ALL PRIVILEGES ON test_db.*` (which includes CREATE, scoped to that one
database). So `CREATE DATABASE IF NOT EXISTS test_db` succeeds as a
no-op with no root involvement.

**Decision: do not switch to root**, in CI or production. Using root
would hide a real permissions bug — if the production DB user is ever
missing CREATE on its own schema, CI using root would never catch it.
The production DB user should be provisioned the same way: scoped
privileges on its own schema only, never global/root.

**Action items:**
- [ ] Keep CI's MySQL service `MYSQL_DATABASE` in sync with `DB_NAME`
      whenever either changes
- [ ] When provisioning the real production database, grant the app's
      production DB user privileges scoped to its own schema only
      (matching what CI validates), not root/global access

## 4. Test result tracking (deferred)

Discussed but not yet decided:
- Minimum: upload raw `npm test` output via `actions/upload-artifact`
  (zero new dependencies)
- Better: add `mocha-junit-reporter` devDependency to emit JUnit XML,
  upload as artifact, optionally feed into a PR-annotating reporter
  action for pass/fail trend visibility

**Action item:**
- [ ] Decide on artifact-only vs JUnit reporter approach, then implement

## 5. Not yet in scope

- ESLint installation/config (flagged above, explicitly deferred)
- Actual deploy/CD stage (Docker build, registry push, deployment
  target) — to be scoped separately once the target platform (Docker
  Desktop locally vs. a registry/cloud target) is decided
