/* eslint-disable no-console */
import 'reflect-metadata';
import { before, after } from 'mocha';
import { Application } from '../src/app';

///////////////////////////////////////////////////////////////////////////

export const infra = Application.instance();

// Set-up
before(async function () {
    this.timeout(30000);
    console.log('Test set-up: starting application and connecting to database...');
    await infra.start();
    console.log('Test set-up: done.\n');
});

// Tear-down
after(async function () {
    this.timeout(10000);
    console.log('\nTest tear-down: closing database connection...');
    await infra.stop();
});

///////////////////////////////////////////////////////////////////////////
