import express from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { Injector } from '../../startup/injector';
import { AuthValidator } from './auth.validator';
import { BaseController } from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class AuthController extends BaseController {

    //#region member variables and constructors

    _service: AuthService = Injector.Container.resolve(AuthService);

    _validator: AuthValidator = new AuthValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    login = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.login(request);
            const result = await this._service.login(model);
            ResponseHandler.success(request, response, 'Login successful!', 200, {
                AccessToken: result.AccessToken,
                ExpiresIn  : result.ExpiresIn,
                User       : result.User,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
