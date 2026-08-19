export interface RequestDto {
    Method  : string;
    Host    : string;
    Body    : any;
    Headers : any;
    Url     : string;
    Params  : any;
}

export interface ResponseDto {
    Status         : string;
    Message        : string;
    HttpCode       : number;
    Data?          : any;
    Trace?         : string[];
    Request?       : RequestDto;
    ClientIps      : string[];
    APIVersion     : string;
    ServiceVersion : string;
}
