/// <reference path="../../node_modules/@types/pouchdb/index.d.ts" />

import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { BaseDatabaseClient } from "./databaseClient";
import { Utils } from "../main/utils/utils";
import { IAccountDatabase } from "./interfaces";

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
    public addDatabase(factory: any) {
        this.database.setDb(factory);
    }

    /**
     * Removes database by name
     */
    public removeDatabase() {
        let database = this.getDatabase();
        if (database) {
            return database.dispose().then(() => {
                delete this.database;
            });
        } else {
            throw new Error("No database found");
        }
    }

    public setProperDb(name: string, database: IAccountDatabase) {
        if (!this.database.checkDb(name)) {
            this.database.dispose();
            this.database.setDb(database);
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