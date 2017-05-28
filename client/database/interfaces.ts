/**
 * Database for client
 */
export interface IAccountDatabase {
    get: (id: string, optons?: databaseOptions) => Promise<IDatabaseError | IDatabaseRecord>;
    put: (doc: IDatabaseRecord, options?: databaseOptions) => Promise<IDatabaseError | any>;
    close: () => Promise<any>;
    remove: (doc: any, options?: databaseOptions) => Promise<any>;
}

export interface IDatabase extends IAccountDatabase {
    allDocs: (options?: databaseOptions) => Promise<any>;
    bulkDocs: (docs: any[], optons?: databaseOptions) => Promise<any>;
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