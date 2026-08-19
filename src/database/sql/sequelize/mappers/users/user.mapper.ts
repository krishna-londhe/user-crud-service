import User from '../../models/users/user.model';
import { UserDto } from '../../../../../domain.types/users/user.dto';

///////////////////////////////////////////////////////////////////////////////////

export class UserMapper {

    static toDto = (user: User): UserDto => {
        if (user == null) {
            return null;
        }
        const dto: UserDto = {
            id        : user.id,
            FirstName : user.FirstName,
            LastName  : user.LastName,
            Email     : user.Email,
            Phone     : user.Phone,
            UserName  : user.UserName,
            IsActive  : user.IsActive,
            CreatedAt : user.CreatedAt,
            UpdatedAt : user.UpdatedAt,
        };
        // Password hash is intentionally never mapped onto the DTO.
        return dto;
    };

}
