import express from 'express';
import { ConfigurationManager } from '../config/configuration.manager';
import { ResponseHandler } from '../common/handlers/response.handler';
import { ApiError } from '../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////
// Client (app-level) authentication - every request must carry the shared
// x-api-key. This identifies the calling app/client, not the end user.

export const authenticateClient = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
): void => {
    try {
        const apiKey = request.headers['x-api-key'] as string;
        const expectedApiKey = ConfigurationManager.ClientApiKey();

        if (!apiKey || apiKey !== expectedApiKey) {
            throw new ApiError(401, 'Invalid or missing client API key.');
        }
        next();
    } catch (error) {
        ResponseHandler.handleError(request, response, error);
    }
};
