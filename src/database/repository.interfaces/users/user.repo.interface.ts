import { UserDomainModel } from '../../../domain.types/users/user.domain.model';
import { UserDto } from '../../../domain.types/users/user.dto';
import { UserCredentials } from '../../../domain.types/users/user.credentials';
import { UserSearchFilters, UserSearchResults } from '../../../domain.types/users/user.search.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

export interface IUserRepo {

    create(userDomainModel: UserDomainModel): Promise<UserDto>;

    getById(id: uuid): Promise<UserDto>;

    getByEmail(email: string): Promise<UserDto>;

    getCredentialsByIdentifier(userNameOrEmail: string): Promise<UserCredentials>;

    exists(email: string, phone?: string, userName?: string): Promise<boolean>;

    search(filters: UserSearchFilters): Promise<UserSearchResults>;

    update(id: uuid, userDomainModel: UserDomainModel): Promise<UserDto>;

    delete(id: uuid): Promise<boolean>;

}
