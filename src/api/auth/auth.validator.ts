import express from 'express';
import { BaseValidator, Where } from '../base.validator';
import { LoginDomainModel } from '../../domain.types/auth/login.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class AuthValidator extends BaseValidator {

    constructor() {
        super();
    }

    login = async (request: express.Request): Promise<LoginDomainModel> => {

        await this.validateString(request, 'UserNameOrEmail', Where.Body, true, false, false, 1, 256);
        await this.validateString(request, 'Password', Where.Body, true, false, false, 6, 128);

        this.validateRequest(request);

        const body = request.body;

        const model: LoginDomainModel = {
            UserNameOrEmail: body.UserNameOrEmail,
            Password       : body.Password,
        };
        return model;
    };

}
