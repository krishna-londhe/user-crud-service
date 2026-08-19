import express from 'express';
import { UserController } from './user.controller';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new UserController();

    router.post('/', controller.create);
    router.get('/search', controller.search);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);
    router.get('/:id', controller.getById);

    app.use('/api/v1/users', router);
};
