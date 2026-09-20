import express from 'express';
import { TokenHelper } from './token.helper';
import { ResponseHandler } from '../common/handlers/response.handler';
import { ApiError } from '../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////
// User authentication - verifies the JWT access token issued by POST /api/v1/auth/login
// and attaches the decoded user onto the request.

export const authenticateUser = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
): void => {
    try {
        const authHeader = request.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new ApiError(401, 'Unauthorized access. Access token is missing.');
        }

        request.currentUser = TokenHelper.verifyAccessToken(token);
        next();
    } catch {
        ResponseHandler.handleError(request, response, new ApiError(401, 'Unauthorized access. Invalid or expired access token.'));
    }
};
