/// <reference path="../../node_modules/@types/pouchdb/index.d.ts" />

import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { BaseDatabaseClient } from "./databaseClient";
import { Utils } from "../main/utils/utils";
import { IAccountDatabase, IDatabase } from "./interfaces";

@Injectable()
export class AccountDatabaseService {
    private database: BaseDatabaseClient;
    constructor(@Inject(Utils) utils: Utils) {
        this.database = new BaseDatabaseClient(utils);
    }

    /**
     * Creates database in pouchdb
     * @param name Name for database
     * @param factory Factory for database creation
     */
    public addDatabase(db: IAccountDatabase | IDatabase) {
        this.database.setDb(db);
    }

    /**
     * Removes database by name
     */
    public removeDatabase() {
        let database = this.getDatabase();
        if (database) {
            return database.dispose();
        } else {
            throw new Error("No database found");
        }
    }

    /**
     * Checks if needed database is set and if not sets it
     * @param name Database constructor name
     * @param database Database constructor
     * @param dbName Database name
     * @param options Database options
     */
    public setProperDb(name: string, database: any, dbName?: string, options?: any) {
        if (!this.database.checkDb(name)) {
            this.database.dispose();
            this.database.setDb(new database(dbName, options));
        }
    }

    /**
     * Gets database from a name
     * @param name Database name
     */
    public getDatabase() {
        return this.database;
    }
}