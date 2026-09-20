import { Op } from 'sequelize';
import { IUserRepo } from '../../../../repository.interfaces/users/user.repo.interface';
import User from '../../models/users/user.model';
import { UserMapper } from '../../mappers/users/user.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { UserDomainModel } from '../../../../../domain.types/users/user.domain.model';
import { UserDto } from '../../../../../domain.types/users/user.dto';
import { UserCredentials } from '../../../../../domain.types/users/user.credentials';
import { UserSearchFilters, UserSearchResults } from '../../../../../domain.types/users/user.search.types';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////

export class UserRepo implements IUserRepo {

    create = async (userDomainModel: UserDomainModel): Promise<UserDto> => {
        try {
            const entity = {
                FirstName : userDomainModel.FirstName,
                LastName  : userDomainModel.LastName ?? null,
                Email     : userDomainModel.Email,
                Phone     : userDomainModel.Phone ?? null,
                UserName  : userDomainModel.UserName ?? null,
                Password  : userDomainModel.Password,
                IsActive  : userDomainModel.IsActive ?? true,
            };
            const user = await User.create(entity);
            return UserMapper.toDto(user);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: uuid): Promise<UserDto> => {
        try {
            const user = await User.findByPk(id);
            return UserMapper.toDto(user);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByEmail = async (email: string): Promise<UserDto> => {
        try {
            const user = await User.findOne({ where: { Email: email } });
            return UserMapper.toDto(user);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getCredentialsByIdentifier = async (userNameOrEmail: string): Promise<UserCredentials> => {
        try {
            const user = await User.findOne({
                where: {
                    [Op.or]: [{ Email: userNameOrEmail }, { UserName: userNameOrEmail }],
                },
            });
            if (user == null) {
                return null;
            }
            return {
                id       : user.id,
                Password : user.Password,
                IsActive : user.IsActive,
            };
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    exists = async (email: string, phone?: string, userName?: string): Promise<boolean> => {
        try {
            const or: Record<string, string>[] = [{ Email: email }];
            if (phone) {
                or.push({ Phone: phone });
            }
            if (userName) {
                or.push({ UserName: userName });
            }
            const user = await User.findOne({ where: { [Op.or]: or } });
            return user != null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: UserSearchFilters): Promise<UserSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.FirstName != null) {
                search.where['FirstName'] = { [Op.like]: '%' + filters.FirstName + '%' };
            }
            if (filters.LastName != null) {
                search.where['LastName'] = { [Op.like]: '%' + filters.LastName + '%' };
            }
            if (filters.Email != null) {
                search.where['Email'] = { [Op.like]: '%' + filters.Email + '%' };
            }
            if (filters.Phone != null) {
                search.where['Phone'] = { [Op.like]: '%' + filters.Phone + '%' };
            }
            if (filters.UserName != null) {
                search.where['UserName'] = { [Op.like]: '%' + filters.UserName + '%' };
            }
            if (filters.IsActive != null) {
                search.where['IsActive'] = filters.IsActive;
            }

            let orderByColumn = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColumn = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColumn, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await User.findAndCountAll(search);
            const dtos = foundResults.rows.map(x => UserMapper.toDto(x));

            const searchResults: UserSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : dtos,
            };

            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: uuid, userDomainModel: UserDomainModel): Promise<UserDto> => {
        try {
            const user = await User.findByPk(id);
            if (user == null) {
                return null;
            }

            if (userDomainModel.FirstName != null) {
                user.FirstName = userDomainModel.FirstName;
            }
            if (userDomainModel.LastName != null) {
                user.LastName = userDomainModel.LastName;
            }
            if (userDomainModel.Email != null) {
                user.Email = userDomainModel.Email;
            }
            if (userDomainModel.Phone != null) {
                user.Phone = userDomainModel.Phone;
            }
            if (userDomainModel.UserName != null) {
                user.UserName = userDomainModel.UserName;
            }
            if (userDomainModel.Password != null) {
                user.Password = userDomainModel.Password;
            }
            if (userDomainModel.IsActive != null) {
                user.IsActive = userDomainModel.IsActive;
            }

            await user.save();

            return UserMapper.toDto(user);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: uuid): Promise<boolean> => {
        try {
            await User.destroy({ where: { id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
