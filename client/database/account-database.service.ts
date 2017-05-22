/// <reference path="../../node_modules/@types/pouchdb/index.d.ts" />

interface DBWindow extends Window {
    PouchDB: PouchDB.Static;
}

declare var window: DBWindow;

import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IDatabaseError, IdatabaseResponse } from "./database.module";

/**
 * Fields for database document
 */
export interface IUserDoc {
    _id: string;
    _rev?: string;
}

/**
 * Object with user token
 */
export interface ITokenDoc extends IUserDoc {
    token: string;
}

/**
 * Object with info about user
 */
export interface IInfoDoc extends IUserDoc {
    name: string;
    surname: string;
    lastName: string;
    email: string;
}

/**
 * Works with user database
 */
@Injectable()
export class AccountDatabaseService {
    public database: PouchDB.Database<{}>;
    constructor() {}

    /**
     * Creates user database
     * @param factory Factory for database creation
     */
    public initDb(factory?: PouchDB.Static) {
        if (factory === undefined) {
            this.database = new window.PouchDB("user");
        } else {
            this.database = new factory("user");
        }
    }

    /**
     * Converts database promises to observables
     * @param request Database promise request
     */
    private toObservable(request: Promise<any>) {
        return Observable.fromPromise(request);
    }

    /**
     * Catches database errors
     * @param response Stream of database responses
     */
    private catchErrors(response: Observable<IdatabaseResponse>): Observable<IdatabaseResponse & IDatabaseError> {
        return response.catch((err, caught) => { return Observable.of(err); });
    }

    /**
     * Gets token from database
     */
    public getToken() {
        return this.catchErrors(this.toObservable(this.database.get("token")));
    }

    /**
     * Gets info about user from database
     */
    public getInfo() {
        return this.catchErrors(this.toObservable(this.database.get("info")));
    }

    /**
     * Sets user access token in the database
     * @param token Users access token
     */
    public setToken(token: ITokenDoc) {
        return this.catchErrors(this.toObservable(this.database.put(token)));
    }

    /**
     * Sets user info in database
     * @param info Object with user info
     */
    public setInfo(info: IInfoDoc) {
        return this.catchErrors(this.toObservable(this.database.put(info)));
    }
}