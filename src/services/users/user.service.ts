import bcrypt from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { IUserRepo } from '../../database/repository.interfaces/users/user.repo.interface';
import { UserDomainModel } from '../../domain.types/users/user.domain.model';
import { UserDto } from '../../domain.types/users/user.dto';
import { UserSearchFilters, UserSearchResults } from '../../domain.types/users/user.search.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../common/api.error';

////////////////////////////////////////////////////////////////////////////////////////////////////////

const SALT_ROUNDS = 10;

@injectable()
export class UserService {

    constructor(
        @inject('IUserRepo') private _userRepo: IUserRepo,
    ) {}

    create = async (model: UserDomainModel): Promise<UserDto> => {
        const alreadyExists = await this._userRepo.exists(model.Email, model.Phone, model.UserName);
        if (alreadyExists) {
            throw new ApiError(409, 'A user with the given email, phone or username already exists.');
        }
        const hashedPassword = await bcrypt.hash(model.Password, SALT_ROUNDS);
        const entity: UserDomainModel = { ...model, Password: hashedPassword };
        return await this._userRepo.create(entity);
    };

    getById = async (id: uuid): Promise<UserDto> => {
        return await this._userRepo.getById(id);
    };

    getByEmail = async (email: string): Promise<UserDto> => {
        return await this._userRepo.getByEmail(email);
    };

    search = async (filters: UserSearchFilters): Promise<UserSearchResults> => {
        return await this._userRepo.search(filters);
    };

    update = async (id: uuid, model: UserDomainModel): Promise<UserDto> => {
        const entity: UserDomainModel = { ...model };
        if (entity.Password) {
            entity.Password = await bcrypt.hash(entity.Password, SALT_ROUNDS);
        }
        return await this._userRepo.update(id, entity);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._userRepo.delete(id);
    };

}
