import bcrypt from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { IUserRepo } from '../../database/repository.interfaces/users/user.repo.interface';
import { LoginDomainModel } from '../../domain.types/auth/login.domain.model';
import { LoginResult } from '../../domain.types/auth/login.result';
import { ApiError } from '../../common/api.error';
import { ConfigurationManager } from '../../config/configuration.manager';
import { TokenHelper } from '../../auth/token.helper';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AuthService {

    constructor(
        @inject('IUserRepo') private _userRepo: IUserRepo,
    ) {}

    login = async (model: LoginDomainModel): Promise<LoginResult> => {
        const credentials = await this._userRepo.getCredentialsByIdentifier(model.UserNameOrEmail);
        if (credentials == null) {
            throw new ApiError(401, 'Invalid username/email or password.');
        }
        if (!credentials.IsActive) {
            throw new ApiError(403, 'This user account is inactive.');
        }

        const passwordMatches = await bcrypt.compare(model.Password, credentials.Password);
        if (!passwordMatches) {
            throw new ApiError(401, 'Invalid username/email or password.');
        }

        const user = await this._userRepo.getById(credentials.id);
        const accessToken = TokenHelper.generateAccessToken({
            UserId  : user.id,
            Email   : user.Email,
            UserName: user.UserName,
        });

        return {
            AccessToken: accessToken,
            ExpiresIn  : ConfigurationManager.AuthConfig().AccessTokenExpiresInSeconds,
            User       : user,
        };
    };

}
