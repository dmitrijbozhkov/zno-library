/// <reference path="../../node_modules/@types/pouchdb/index.d.ts" />

interface DBWindow extends Window {
    PouchDB: PouchDB.Static;
}

declare var window: DBWindow;

import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IDatabaseError, IDatabaseRecord, databaseOptions, IDatabase, IUserDoc } from "./interfaces";

/**
 * Works with user database
 */
@Injectable()
export class DatabaseService {
    private databases: { [database: string]: DatabaseClient<any> };
    constructor() {
        this.databases = {};
    }

    /**
     * Creates database in pouchdb
     * @param name Name for database
     * @param factory Factory for database creation
     */
    public addDatabase(name: string, factory: any, options?: any) {
        if (this.getDb(name)) {
            throw new Error("Database already exists");
        } else {
            this.databases[name] = new DatabaseClient();
            this.databases[name].setDb(new factory(name, options));
        }
    }

    /**
     * Gets database from a name
     * @param name Database name
     */
    private getDb(name: string) {
        return this.databases[name];
    }

    /**
     * Returns database by name
     * @param name Name of the database
     */
    public getDatabase(name: string) {
        let database = this.getDb(name);
        if (database) {
            return database;
        } else {
            throw new Error("No database found");
        }
    }

    /**
     * Removes database by name
     * @param name Name of the database
     */
    public removeDatabase(name: string) {
        let database = this.getDb(name);
        if (database) {
            return database.dispose().then(() => {
                delete this.databases[name];
            });
        } else {
            throw new Error("No database found");
        }
    }
}

/**
 * Client for working with database
 */
export class DatabaseClient<T> {
    private database: IDatabase;
    constructor() {}

    /**
     * Handles database response
     * @param response Stream of database responses
     */
    private handleResponse(response:  Promise<PouchDB.Core.Response>): Observable<T & IDatabaseError> {
        return Observable.fromPromise(response).catch((err, caught) => { return Observable.of(err); });
    }

    /**
     * Gets token from database
     * @param request Observable with database get request
     */
    public getRecord(request: Observable<[string, databaseOptions]>) {
        return request.map((req) => {
            return this.handleResponse(this.database.get(req[0], req[1]) as any);
        }).concatAll();
    }

    /**
     * Sets user info in database
     * @param request Observable with item to set
     */
    public putRecord(request: Observable<[T, databaseOptions]>) {
        return request.map((req) => {
            return this.handleResponse(this.database.put(req[0], req[1]));
        }).concatAll();
    }

    /**
     * Gets all records from database
     * @param request Observable with requst options
     */
    public getAllRecords(request: Observable<databaseOptions>) {
        return request.map((req) => {
            return this.handleResponse(this.database.allDocs(req));
        }).concatAll();
    }

    /**
     * Sets all records in database
     * @param request Observable with item array and optons
     */
    public putAllRecords(request: Observable<[any[], databaseOptions]>) {
        return request.map((req) => {
            return this.handleResponse(this.database.bulkDocs(req[0], req[1]));
        }).concatAll();
    }

    /**
     * Sets database
     * @param database Database to use
     */
    public setDb(database: IDatabase) {
        this.database = database;
    }

    /**
     * Michanges database to database provided by factory
     * @param factory Database factory
     */
    public migrate(database: IDatabase) {
        let data = this.getAllRecords(Observable.of({ include_docs: true, attachments: true })).map((docs) => {
            let rows = (docs as any).rows.map((row) => { return row.doc; });
            this.dispose();
            this.database = database;
            return [rows, {}];
        });
        return this.putAllRecords(data);
    }

    /**
     * Disposes database connection
     */
    public dispose() {
        return this.database.close();
    }
}

/**
 * Stores information in memory
 */
export class InMemoryStore<T> implements IDatabase {
    private store: { [item: string]: T };
    constructor(store?: { [item: string]: T }) {
        if (!store) {
            this.store = {};
        } else {
            this.store = store;
        }
        // console.log(this.store);
    }

    /**
     * Returns document by id
     * @param id Id of document
     * @param options Options for getting document
     */
    public get(id: string, options?: any) {
        if (this.store[id]) {
            return Promise.resolve(this.store[id]);
        } else {
            return Promise.reject({ error: true, message: "not found", name: "get", reason: "", status: 404});
        }
    }

    /**
     * Puts new document in database
     * @param item Item to put
     * @param options Options for putting options
     */
    public put(item: T, options?: any) {
        this.store[(item as any)._id] = item;
        return Promise.resolve({ "OK": true });
    }

    /**
     * Gets all docs from database
     * @param options Options for fetching documents
     */
    public allDocs(options?: any) {
        let names = Object.keys(this.store);
        return Promise.resolve(names.map((name) => { return this.store[name]; }));
    }

    /**
     * Pushes multiole documents a once
     * @param docs Array of documents to add
     * @param options Options for adding documents
     */
    public bulkDocs(docs: any[], options?: any) {
        let responses = [];
        docs.forEach((doc) => {
            this.put(doc);
            responses.push({ "OK": true, id: doc._id });
        });
        return Promise.resolve(responses);
    }

    /**
     * Closes database
     */
    public close() {
        this.store = null;
        return Promise.resolve(true);
    }
}