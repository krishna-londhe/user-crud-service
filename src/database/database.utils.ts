import mysql from 'mysql2/promise';
import { ConfigurationManager } from '../config/configuration.manager';
import { Logger } from '../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class DatabaseUtils {

    // Creates the target database if it does not already exist, so a fresh
    // MySQL instance can boot this service without a manual setup step.
    public static createDbIfNotExists = async (): Promise<void> => {
        const config = ConfigurationManager.DatabaseConfig();
        const connection = await mysql.createConnection({
            host     : config.Host,
            port     : config.Port,
            user     : config.Username,
            password : config.Password,
        });
        try {
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.DatabaseName}\`;`);
            Logger.instance().log(`Database '${config.DatabaseName}' is ready.`);
        } finally {
            await connection.end();
        }
    };

}
