import { Dialect } from "sequelize";

///////////////////////////////////////////////////////////////////////////////////////

export interface DatabaseConfig {
    Host        : string;
    Port        : number;
    DatabaseName: string;
    Username    : string;
    Password    : string;
    Dialect     : Dialect;
    Synchronize : boolean;
    Pool        : {
        Min     : number;
        Max     : number;
        Acquire : number;
        Idle    : number;
    };
}

export interface AuthConfig {
    AccessTokenSecret          : string;
    AccessTokenExpiresInSeconds: number;
}

export class ConfigurationManager {

    static DatabaseConfig(): DatabaseConfig {
        return {
            Host         : process.env.DB_HOST || 'localhost',
            Port         : parseInt(process.env.DB_PORT || '3306', 10),
            DatabaseName : process.env.DB_NAME || 'user_crud_db',
            Username     : process.env.DB_USERNAME || 'root',
            Password     : process.env.DB_PASSWORD || '',
            Dialect      : (process.env.DB_DIALECT as Dialect) || 'mysql',
            Synchronize  : (process.env.DB_SYNCHRONIZE ?? 'true') === 'true',
            Pool         : {
                Min     : parseInt(process.env.DB_POOL_MIN || '2', 10),
                Max     : parseInt(process.env.DB_POOL_MAX || '10', 10),
                Acquire : parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
                Idle    : parseInt(process.env.DB_POOL_IDLE || '10000', 10),
            },
        };
    }

    static Port(): number {
        return parseInt(process.env.PORT || '3000', 10);
    }

    static AuthConfig(): AuthConfig {
        return {
            AccessTokenSecret           : process.env.USER_ACCESS_TOKEN_SECRET || 'dev-access-token-secret',
            AccessTokenExpiresInSeconds : parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN_SECONDS || '3600', 10),
        };
    }

    static ClientApiKey(): string {
        return process.env.CLIENT_API_KEY || '';
    }

}
