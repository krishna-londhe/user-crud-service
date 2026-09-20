import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ConfigurationManager } from '../config/configuration.manager';
import { CurrentUser } from '../domain.types/miscellaneous/current.user';

///////////////////////////////////////////////////////////////////////////////////////

export class TokenHelper {

    public static generateAccessToken = (user: CurrentUser): string => {
        const config = ConfigurationManager.AuthConfig();
        const secret: Secret = config.AccessTokenSecret;
        const options: SignOptions = {
            expiresIn: `${config.AccessTokenExpiresInSeconds}s`,
        };
        return jwt.sign({ ...user }, secret, options);
    };

    public static verifyAccessToken = (token: string): CurrentUser => {
        const config = ConfigurationManager.AuthConfig();
        return jwt.verify(token, config.AccessTokenSecret) as CurrentUser;
    };

}
