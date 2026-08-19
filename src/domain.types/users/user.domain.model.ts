import { uuid } from "../miscellaneous/system.types";

export interface UserDomainModel {
    id?               : uuid;
    FirstName         : string;
    LastName?         : string;
    Email             : string;
    Phone?            : string;
    UserName?         : string;
    Password?         : string;
    IsActive?         : boolean;
}
