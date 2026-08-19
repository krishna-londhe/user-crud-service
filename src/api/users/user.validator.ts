import express from 'express';
import { BaseValidator, Where } from '../base.validator';
import { UserDomainModel } from '../../domain.types/users/user.domain.model';
import { UserSearchFilters } from '../../domain.types/users/user.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserValidator extends BaseValidator {

    constructor() {
        super();
    }

    create = async (request: express.Request): Promise<UserDomainModel> => {

        await this.validateString(request, 'FirstName', Where.Body, true, false);
        await this.validateString(request, 'LastName', Where.Body, false, true);
        await this.validateEmail(request, 'Email', Where.Body, true, false);
        await this.validatePhone(request, 'Phone', Where.Body, false, true);
        await this.validateString(request, 'UserName', Where.Body, false, true, false, 1, 32);
        await this.validateString(request, 'Password', Where.Body, true, false, false, 6, 128);
        await this.validateBoolean(request, 'IsActive', Where.Body, false, true);

        this.validateRequest(request);

        const body = request.body;

        const model: UserDomainModel = {
            FirstName : body.FirstName,
            LastName  : body.LastName ?? null,
            Email     : body.Email,
            Phone     : body.Phone ?? null,
            UserName  : body.UserName ?? null,
            Password  : body.Password,
            IsActive  : body.IsActive ?? true,
        };
        return model;
    };

    update = async (request: express.Request): Promise<UserDomainModel> => {

        await this.validateString(request, 'FirstName', Where.Body, false, true);
        await this.validateString(request, 'LastName', Where.Body, false, true);
        await this.validateEmail(request, 'Email', Where.Body, false, true);
        await this.validatePhone(request, 'Phone', Where.Body, false, true);
        await this.validateString(request, 'UserName', Where.Body, false, true, false, 1, 32);
        await this.validateString(request, 'Password', Where.Body, false, true, false, 6, 128);
        await this.validateBoolean(request, 'IsActive', Where.Body, false, true);

        this.validateRequest(request);

        const body = request.body;

        const model: UserDomainModel = {
            FirstName : body.FirstName ?? null,
            LastName  : body.LastName ?? null,
            Email     : body.Email ?? null,
            Phone     : body.Phone ?? null,
            UserName  : body.UserName ?? null,
            Password  : body.Password ?? null,
            IsActive  : body.IsActive ?? null,
        };
        return model;
    };

    search = async (request: express.Request): Promise<UserSearchFilters> => {

        await this.validateString(request, 'firstName', Where.Query, false, false);
        await this.validateString(request, 'lastName', Where.Query, false, false);
        await this.validateString(request, 'email', Where.Query, false, false);
        await this.validateString(request, 'phone', Where.Query, false, false);
        await this.validateString(request, 'userName', Where.Query, false, false);
        await this.validateBoolean(request, 'isActive', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        const model: UserSearchFilters = {
            FirstName : request.query.firstName as string ?? null,
            LastName  : request.query.lastName as string ?? null,
            Email     : request.query.email as string ?? null,
            Phone     : request.query.phone as string ?? null,
            UserName  : request.query.userName as string ?? null,
            // validateBoolean() already ran toBoolean(), so request.query.isActive is a real
            // boolean (or undefined when absent) by the time we get here - not a string.
            IsActive  : request.query.isActive === undefined ? null : request.query.isActive as unknown as boolean,
        };
        return this.updateBaseSearchFilters(request, model);
    };

}
