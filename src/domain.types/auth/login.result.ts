import { UserDto } from "../users/user.dto";

export interface LoginResult {
    AccessToken: string;
    ExpiresIn  : number;
    User       : UserDto;
}
