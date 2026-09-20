import { uuid } from "./system.types";

export interface CurrentUser {
    UserId  : uuid;
    Email  ?: string;
    UserName?: string;
}
