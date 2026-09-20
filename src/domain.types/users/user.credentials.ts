import { uuid } from "../miscellaneous/system.types";

export interface UserCredentials {
    id      : uuid;
    Password: string;
    IsActive: boolean;
}
