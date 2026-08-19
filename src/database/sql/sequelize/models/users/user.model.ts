import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    PrimaryKey,
    Length,
    IsUUID,
    IsEmail,
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'User',
    tableName        : 'users',
    paranoid         : true,
    freezeTableName  : true,
})
export default class User extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => v4(),
        allowNull    : false,
    })
    id: string;

    @Length({ min: 1, max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    FirstName: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    LastName: string;

    @IsEmail
    @Length({ min: 3, max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
        unique    : true,
    })
    Email: string;

    @Length({ min: 7, max: 24 })
    @Column({
        type      : DataType.STRING(24),
        allowNull : true,
        unique    : true,
    })
    Phone: string;

    @Length({ min: 1, max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
        unique    : true,
    })
    UserName: string;

    @Length({ min: 6, max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Password: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : true,
    })
    IsActive: boolean;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
