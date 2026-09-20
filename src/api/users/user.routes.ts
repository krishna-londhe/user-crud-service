import express from 'express';
import { UserController } from './user.controller';
import { authenticateUser } from '../../auth/authenticate.user.middleware';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserController();

    // Registration stays open at the user-auth layer - there is no access token
    // to present before an account exists. It is still gated by the client API
    // key applied globally in app.ts.
    router.post('/', controller.create);

    router.get('/search', authenticateUser, controller.search);
    router.put('/:id', authenticateUser, controller.update);
    router.delete('/:id', authenticateUser, controller.delete);
    router.get('/:id', authenticateUser, controller.getById);

    app.use('/api/v1/users', router);
};
