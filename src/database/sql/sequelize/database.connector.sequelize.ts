import * as fs from 'fs';
import * as path from 'path';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '../../../common/logger';
import { IDatabaseConnector } from '../../database.connector.interface';
import { ConfigurationManager } from '../../../config/configuration.manager';
import { DatabaseUtils } from '../../database.utils';

//////////////////////////////////////////////////////////////

export class DatabaseConnector_Sequelize implements IDatabaseConnector {

    private _sequelize: Sequelize = null;

    public static db: Sequelize = null;

    public connect = async (): Promise<boolean> => {
        try {
            const config = ConfigurationManager.DatabaseConfig();

            await DatabaseUtils.createDbIfNotExists();

            const modelsFolder = path.join(__dirname, '/models');
            const modelsPath = getFoldersRecursively(modelsFolder);

            const sequelize = new Sequelize(config.DatabaseName, config.Username, config.Password, {
                host    : config.Host,
                port    : config.Port,
                dialect : config.Dialect as Dialect,
                models  : modelsPath,
                pool    : {
                    max     : config.Pool.Max,
                    min     : config.Pool.Min,
                    acquire : config.Pool.Acquire,
                    idle    : config.Pool.Idle,
                },
                logging : false,
            });
            this._sequelize = sequelize;

            Logger.instance().log(`Connecting to database '${config.DatabaseName}' ...`);

            await this._sequelize.authenticate();
            Logger.instance().log(`Schema auto-sync (alter) = ${config.Synchronize}`);
            await this._sequelize.sync({ force: false, alter: config.Synchronize });

            Logger.instance().log(`Connected to database '${config.DatabaseName}'.`);

            DatabaseConnector_Sequelize.db = this._sequelize;

            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

    public sync = async (): Promise<boolean> => {
        try {
            await this._sequelize.sync({ alter: true });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

}

///////////////////////////////////////////////////////////////////////////////////////////

function getFoldersRecursively(location: string) {
    const items = fs.readdirSync(location, { withFileTypes: true });
    let paths = [];
    for (const item of items) {
        if (item.isDirectory()) {
            const fullPath = path.join(location, item.name);
            const childrenPaths = getFoldersRecursively(fullPath);
            paths = [...paths, fullPath, ...childrenPaths];
        }
    }
    return paths;
}
