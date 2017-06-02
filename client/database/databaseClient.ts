import { IDatabaseError, IDatabaseRecord, databaseOptions, IAccountDatabase, IUserDoc, IDatabase } from "./interfaces";
import { Utils } from "../main/utils/utils";
import { Observable } from "rxjs";

export class BaseDatabaseClient {
    public database: IAccountDatabase;
    public handler: Utils;
    constructor(handler: Utils) {
        this.handler = handler;
    }

    /**
     * Gets record from database
     * @param request Observable with database get request
     */
    public getRecord(request: Observable<[string, databaseOptions]>) {
        return request.map((req) => {
            return this.handler.handleResponse(this.database.get(req[0], req[1]) as any);
        }).concatAll();
    }

    /**
     * Sets record in database
     * @param request Observable with item to set
     */
    public putRecord(request: Observable<[any, databaseOptions]>) {
        return request.map((req) => {
            return this.handler.handleResponse(this.database.put(req[0], req[1]));
        }).concatAll();
    }

    /**
     * Removes record from database
     * @param request Observable with item to set
     */
    public removeRecord(request: Observable<[any, databaseOptions]>) {
        return request.map((req) => {
            return this.handler.handleResponse(this.database.remove(req[0], req[1]));
        }).concatAll();
    }

    /**
     * Sets database
     * @param database Database to use
     */
    public setDb(database: IAccountDatabase | IDatabase) {
        this.database = database;
    }

    /**
     * Checks if database belongs to certain type
     * @param maker Name of the database constructor
     */
    public checkDb(maker: string) {
        return this.database.constructor.name === maker;
    }

    /**
     * Returns if database is set
     */
    public isSetDb() {
        return !!this.database;
    }

    /**
     * Disposes database connection
     */
    public dispose() {
        return this.database.close();
    }
}

/**
 * Client for working with database
 */
export class DatabaseClient<T> extends BaseDatabaseClient {
    public database: IDatabase;
    constructor(handler: Utils) {
        super(handler);
    }

    /**
     * Gets all records from database
     * @param request Observable with requst options
     */
    public getAllRecords(request: Observable<databaseOptions>) {
        return request.map((req) => {
            return this.handler.handleResponse(this.database.allDocs(req));
        }).concatAll();
    }

    /**
     * Sets all records in database
     * @param request Observable with item array and optons
     */
    public putAllRecords(request: Observable<[any[], databaseOptions]>) {
        return request.map((req) => {
            return this.handler.handleResponse(this.database.bulkDocs(req[0], req[1]));
        }).concatAll();
    }
}