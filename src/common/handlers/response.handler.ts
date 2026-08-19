import express from 'express';
import { ResponseDto } from '../../domain.types/miscellaneous/response.dto';
import { ApiError } from '../api.error';
import { InputValidationError } from '../input.validation.error';
import { Logger } from '../logger';

///////////////////////////////////////////////////////////////////////

export class ResponseHandler {

    public static failure(
        request: express.Request,
        response: express.Response,
        message?: string,
        httpErrorCode?: number,
        error?: Error
    ) {
        const ips = [request.header('x-forwarded-for') || request.socket.remoteAddress];
        const msg = error ? error.message : (message ? message : 'An error has occurred.');
        const errorStack = error ? error.stack : '';
        const trace = errorStack ? errorStack.split('\n').map(x => x.trim()) : [];

        const responseObject: ResponseDto = {
            Status         : 'failure',
            Message        : msg,
            HttpCode       : httpErrorCode ? httpErrorCode : 500,
            Trace          : trace,
            ClientIps      : request && request.ips.length > 0 ? request.ips : ips,
            APIVersion     : process.env.API_VERSION,
            ServiceVersion : process.env.SERVICE_VERSION,
        };

        if (process.env.NODE_ENV !== 'test') {
            Logger.instance().log(JSON.stringify(responseObject, null, 2));
        }

        delete responseObject.Trace;

        return response.status(httpErrorCode ?? 500).send(responseObject);
    }

    public static success(
        request: express.Request,
        response: express.Response,
        message: string,
        httpCode: number,
        data?: any) {

        const ips = [request.header('x-forwarded-for') || request.socket.remoteAddress];

        const responseObject: ResponseDto = {
            Status         : 'success',
            Message        : message,
            HttpCode       : httpCode ?? 200,
            Data           : data ?? null,
            ClientIps      : request && request.ips.length > 0 ? request.ips : ips,
            APIVersion     : process.env.API_VERSION,
            ServiceVersion : process.env.SERVICE_VERSION,
        };

        if (process.env.NODE_ENV !== 'test') {
            Logger.instance().log(JSON.stringify(responseObject, null, 2));
        }

        return response.status(httpCode).send(responseObject);
    }

    static handleError(request: express.Request, response: express.Response, error: Error) {
        if (error instanceof InputValidationError) {
            const validationError = error as InputValidationError;
            ResponseHandler.failure(request, response, validationError.message, validationError.httpErrorCode, error);
        } else if (error instanceof ApiError) {
            const err = error as ApiError;
            ResponseHandler.failure(request, response, err.errorMessage, err.httpErrorCode, error);
        } else {
            ResponseHandler.failure(request, response, error?.message, 400, error);
        }
    }

}
