import 'dotenv/config';
import { Application } from './app';
import { ConfigurationManager } from './config/configuration.manager';
import { Logger } from './common/logger';

///////////////////////////////////////////////////////////////////////////////////////

(async () => {
    try {
        const application = Application.instance();
        await application.start();

        const port = ConfigurationManager.Port();
        application.app.listen(port, () => {
            Logger.instance().log(`User CRUD service is running on port ${port}.`);
        });
    } catch (error) {
        Logger.instance().log(`Failed to start service: ${error.message}`);
        process.exit(1);
    }
})();
