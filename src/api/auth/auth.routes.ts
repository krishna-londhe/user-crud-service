import express from 'express';
import { AuthController } from './auth.controller';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AuthController();

    router.post('/login', controller.login);

    app.use('/api/v1/auth', router);
};
