import express from 'express';
import { body, param, query, ValidationChain, validationResult } from 'express-validator';
import { Helper } from '../common/helper';
import { integer, uuid } from '../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export enum Where {
    Body  = 'Body',
    Param = 'Param',
    Query = 'Query'
}

export class BaseValidator {

    //#region Param extraction

    getParamUuid = async (request: express.Request, field: string): Promise<uuid> => {
        await this.validateUuid(request, field, Where.Param, true, false);
        this.validateRequest(request);
        return request.params[field];
    };

    getParamInt = async (request: express.Request, field: string): Promise<number> => {
        await this.validateInt(request, field, Where.Param, false, false);
        this.validateRequest(request);
        const p = request.params[field];
        return parseInt(p);
    };

    //#endregion

    validateUuid = async (
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        let chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.isUUID(4);

        await chain.run(request);
    };

    validateString = async (
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean,
        escape?: boolean,
        minLength?: number,
        maxLength?: number) => {

        let chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        if (escape) chain = chain.escape();
        chain = this.checkLength(chain, minLength, maxLength);

        await chain.run(request);
    };

    validateBoolean = async (
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        let chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.isBoolean();
        chain = chain.toBoolean();

        await chain.run(request);
    };

    validateInt = async (
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        let chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.isInt();
        chain = chain.toInt();

        await chain.run(request);
    };

    validateEmail = async (
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        let chain: ValidationChain = this.getValidationChain(field, where);
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.trim();
        chain = chain.isEmail();
        chain = chain.normalizeEmail();

        await chain.run(request);
    };

    validatePhone = async (
        request: express.Request,
        field: string,
        where: Where,
        required: boolean,
        nullable: boolean) => {

        let chain: ValidationChain = this.getValidationChain(field, where);
        chain = chain.trim();
        chain = this.checkRequired(required, chain, nullable);
        chain = chain.customSanitizer(Helper.sanitizePhone);
        chain = chain.custom(Helper.validatePhone);

        await chain.run(request);
    };

    validateBaseSearchFilters = async (request: express.Request) => {
        await this.validateString(request, 'orderBy', Where.Query, false, false, true);
        await this.validateString(request, 'order', Where.Query, false, false, true);
        await this.validateInt(request, 'pageIndex', Where.Query, false, false);
        await this.validateInt(request, 'itemsPerPage', Where.Query, false, false);

        if (request.query.order !== undefined &&
            request.query.order !== 'descending' &&
            request.query.order !== 'ascending') {
            request.query.order = 'descending';
        }
    };

    validateRequest = (request: express.Request) => {
        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    };

    updateBaseSearchFilters = (request: express.Request, filters: any): any => {
        const pageIndex: integer = request.query.pageIndex ?
            parseInt(request.query.pageIndex as string, 10) : 0;

        const itemsPerPage: integer = request.query.itemsPerPage ?
            parseInt(request.query.itemsPerPage as string, 10) : 25;

        filters['OrderBy']      = request.query.orderBy as string ?? 'CreatedAt';
        filters['Order']        = request.query.order as string ?? 'descending';
        filters['PageIndex']    = pageIndex;
        filters['ItemsPerPage'] = itemsPerPage;

        return filters;
    };

    //#region Protected

    checkLength(chain: ValidationChain, minLength?: number, maxLength?: number) {
        if (minLength || maxLength) {
            const options = {};
            if (minLength) options['min'] = minLength;
            if (maxLength) options['max'] = maxLength;
            chain = chain.isLength(options);
        }
        return chain;
    }

    checkRequired(required: boolean, chain: ValidationChain, nullable: boolean) {
        if (required) {
            chain = chain.exists();
        } else {
            chain = chain.optional({ nullable: nullable });
        }
        return chain;
    }

    getValidationChain(field: string, where: Where): ValidationChain {
        let chain: ValidationChain = null;
        if (where === Where.Body) {
            chain = body(field);
        } else if (where === Where.Param) {
            chain = param(field);
        } else {
            chain = query(field);
        }
        return chain;
    }

    //#endregion

}
