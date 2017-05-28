/// <reference path="../../node_modules/@types/pouchdb/index.d.ts" />

import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { IDatabaseError, IDatabaseRecord, databaseOptions, IAccountDatabase, IUserDoc } from "./interfaces";
import { Utils } from "../main/utils/utils";
import { DatabaseClient } from "./databaseClient";

/**
 * Works with user database
 */
@Injectable()
export class DatabaseService {
    private databases: { [database: string]: DatabaseClient<any> };
    private handler: Utils;
    constructor(@Inject(Utils) utils: Utils) {
        this.handler = utils;
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
            this.databases[name] = new DatabaseClient(this.handler);
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