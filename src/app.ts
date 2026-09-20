import 'reflect-metadata';
import express from 'express';
import { Injector } from './startup/injector';
import { DatabaseConnector_Sequelize } from './database/sql/sequelize/database.connector.sequelize';
import { Logger } from './common/logger';
import { register as registerUserRoutes } from './api/users/user.routes';
import { register as registerAuthRoutes } from './api/auth/auth.routes';
import { authenticateClient } from './auth/authenticate.client.middleware';

///////////////////////////////////////////////////////////////////////////////////////

export class Application {

    public app: express.Application = null;

    private static _instance: Application = null;

    private constructor() {
        this.app = express();
    }

    public static instance(): Application {
        return this._instance || (this._instance = new Application());
    }

    public start = async (): Promise<void> => {
        this.setMiddlewares();
        Injector.registerInjections();
        await this.connectDatabase();
        this.setRoutes();
    };

    public stop = async (): Promise<void> => {
        if (DatabaseConnector_Sequelize.db) {
            await DatabaseConnector_Sequelize.db.close();
        }
    };

    private setMiddlewares = (): void => {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    };

    private connectDatabase = async (): Promise<void> => {
        const connector = new DatabaseConnector_Sequelize();
        const connected = await connector.connect();
        if (!connected) {
            throw new Error('Unable to connect to the database.');
        }
    };

    private setRoutes = (): void => {
        // Registered before the client-key check below, so health checks
        // (used by load balancers / container orchestrators) stay unauthenticated.
        this.app.get('/api/v1/health', (_req, res) => {
            res.status(200).send({ Status: 'success', Message: 'Service is up and running.' });
        });

        // Client (app-level) authentication - compulsory for every route registered
        // below this point.
        this.app.use(authenticateClient);

        registerAuthRoutes(this.app);
        registerUserRoutes(this.app);

        Logger.instance().log('Routes registered.');
    };

}
