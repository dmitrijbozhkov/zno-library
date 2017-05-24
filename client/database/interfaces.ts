/**
 * Database for client
 */
export interface IDatabase {
    get: (id: string, optons?: any) => Promise<IDatabaseError | IDatabaseRecord>;
    put: (doc: IDatabaseRecord, options?: any) => Promise<IDatabaseError | any>;
    close: () => Promise<any>;
    allDocs: (options?: any) => Promise<any>;
    bulkDocs: (docs: any[], optons?: any) => Promise<any>;
}

/**
 * Interface of database errors
 */
export interface IDatabaseError {
    error: boolean;
    message: string;
    name: string;
    reason: string;
    status: number;
}

/**
 * Interface of database responses
 */
export interface IDatabaseRecord {
    _id?: string;
    _rev?: string;
    [data: string]: any;
}

/**
 * Options for database
 */
export type databaseOptions = { [options: string]: any };

/**
 * Object with info about user and token
 */
export interface IUserDoc extends IDatabaseRecord {
    token: string;
    name: string;
    surname: string;
    lastName: string;
    email: string;
    roles: string[];
}