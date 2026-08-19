export interface IDatabaseConnector {
    connect(): Promise<boolean>;
    sync(): Promise<boolean>;
}
