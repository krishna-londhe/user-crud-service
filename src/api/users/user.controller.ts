import express from 'express';
import { UserService } from '../../services/users/user.service';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { Injector } from '../../startup/injector';
import { UserValidator } from './user.validator';
import { ApiError } from '../../common/api.error';
import { BaseController } from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class UserController extends BaseController {

    //#region member variables and constructors

    _service: UserService = Injector.Container.resolve(UserService);

    _validator: UserValidator = new UserValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.create(request);
            const user = await this._service.create(model);
            if (user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            ResponseHandler.success(request, response, 'User created successfully!', 201, {
                User : user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId = await this._validator.getParamUuid(request, 'id');
            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                User : user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.search(request);
            const users = await this._service.search(filters);
            ResponseHandler.success(request, response, 'Users retrieved successfully!', 200, {
                Users : users,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId = await this._validator.getParamUuid(request, 'id');
            const model = await this._validator.update(request);
            const existingUser = await this._service.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }
            const updatedUser = await this._service.update(userId, model);
            if (updatedUser == null) {
                throw new ApiError(400, 'Unable to update user!');
            }
            ResponseHandler.success(request, response, 'User updated successfully!', 200, {
                User : updatedUser,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId = await this._validator.getParamUuid(request, 'id');
            const existingUser = await this._service.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }
            const success = await this._service.delete(userId);
            if (!success) {
                throw new ApiError(400, 'User cannot be deleted.');
            }
            ResponseHandler.success(request, response, 'User deleted successfully!', 200, {
                Deleted : success,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
