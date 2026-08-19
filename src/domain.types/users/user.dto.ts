export interface UserDto {
    id         : string;
    FirstName  : string;
    LastName  ?: string;
    Email      : string;
    Phone     ?: string;
    UserName  ?: string;
    IsActive   : boolean;
    CreatedAt ?: Date;
    UpdatedAt ?: Date;
}
