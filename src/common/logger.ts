/* eslint-disable no-console */

export class Logger {

    private static _instance: Logger = null;

    private constructor() {
    }

    public static instance(): Logger {
        return this._instance || (this._instance = new this());
    }

    public log = (message: string): void => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const dateTime = new Date().toISOString();
        console.log(`${dateTime}> ${message}`);
    };

    public error = (message: string, code: number, details: unknown): void => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const dateTime = new Date().toISOString();
        const err = { message, code, details };
        console.log(`${dateTime}> ${JSON.stringify(err, null, 2)}`);
    };

}
