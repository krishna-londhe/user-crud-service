import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { UserDto } from "./user.dto";

export interface UserSearchFilters extends BaseSearchFilters {
    FirstName ?: string;
    LastName  ?: string;
    Email     ?: string;
    Phone     ?: string;
    UserName  ?: string;
    IsActive  ?: boolean;
}

export interface UserSearchResults extends BaseSearchResults {
    Items : UserDto[];
}
