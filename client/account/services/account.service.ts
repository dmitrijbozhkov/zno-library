import { Injectable, Inject } from "@angular/core";
import { ReplaySubject, Observable } from "rxjs";
import { Http, Response } from "@angular/http";
import { DatabaseClient, IUserDoc } from "../../database/database.module";
import { AccountHttpService } from "../../http/http.module";
import { LoadingService } from "../../main/load/loading.service";
import { AccountDatabaseService } from "../../database/account-database.service";
import { InMemoryStore } from "../../database/inMemoryStore";

/**
 * Data for creating user
 */
export interface ICreate {
    email: string;
    password: string;
    name: string;
    surname: string;
    lastName: string;
}

/**
 * Login credentials
 */
export interface ILoginCredentials {
    email: string;
    password: string;
    remember: boolean;
}

/**
 * Response from logging in
 */
export interface ILoginResponse {
    token: string;
    email: string;
    roles: string[];
    name: string;
    surname: string;
    lastName: string;
}

/**
 * States of account
 */
export enum TokenState {
    "pending",
    "unauthorized",
    "authorized"
}

@Injectable()
export class AccountService {
    private pouch: PouchDB.Static;
    private http: AccountHttpService;
    private database: AccountDatabaseService;
    private loading: LoadingService;
    public state: ReplaySubject<TokenState>;
    constructor(@Inject(AccountDatabaseService) database: AccountDatabaseService, @Inject(AccountHttpService) http: AccountHttpService, @Inject(Window) window: Window, @Inject(LoadingService) loading: LoadingService) {
        this.pouch = (window as any).PouchDB;
        this.state = new ReplaySubject();
        this.http = http;
        this.loading = loading;
        this.database = database;
    }

    /**
     * Initializes account service
     */
    public initAccount() {
        if (!this.database.getDatabase().isSetDb()) {
            this.state.next(TokenState["pending"]);
            this.database.addDatabase(new this.pouch("user", { auto_compaction: true }));
            this.checkAuth().subscribe((response) => {
                this.state.next(TokenState["authorized"]);
            }, (err) => {
                this.state.next(TokenState["unauthorized"]);
            });
        }
    }

    /**
     * Sets database store to use either PouchDB or InMemoryStore
     * @param persistent Will database data be persistent
     */
    private setProperStore(persistent: boolean) {
        if (persistent) {
            this.database.setProperDb("Te", this.pouch, "user", { auto_compaction: true });
        } else {
            this.database.setProperDb("InMemoryStore", InMemoryStore);
        }
    }

    /**
     * Checks if user is logged in
     */
    public checkAuth(): Observable<IUserDoc> {
        this.loading.onStart();
        return this.database.getDatabase().getRecord(Observable.of(["token", {}])).do(() => {
            this.loading.onEnd();
        }, () => {
            this.loading.onEnd();
        });
    }

    /**
     * Handles login response
     * @param response Observable with response
     * @param remember Should token be remembered
     */
    private handleLogin(response: Observable<Response>, remember: boolean) {
        return response.map((response) => {
            this.loading.onComplete(50);
            this.setProperStore(remember);
            let parsedResponse = response.json();
            return [ Object.assign(parsedResponse, { "_id": "token" }), {} ];
        });
    }

    /**
     * Logs in user
     * @param credentials Login credentials and should auth be remembered
     */
    public logIn(credentials: ILoginCredentials): Observable<any> {
        this.loading.onStart();
        let httpResponse = this.http.loginUser(Observable.of(credentials));
        let loginHandled = this.handleLogin(httpResponse, credentials.remember);
        let databaseResponse = this.database.getDatabase().putRecord(loginHandled);
        return databaseResponse.do((value) => {
            this.loading.onEnd();
            this.state.next(TokenState["authorized"]);
        }, (error) => {
            this.loading.onEnd();
            this.state.next(TokenState["unauthorized"]);
        });
    }

    /**
     * Logs off user
     */
    public logOff() {
        this.loading.onStart();
        let database = this.database.getDatabase();
        let getToken = database.getRecord(Observable.of(["token", {}])).map((response) => {
            return [ response, {} ];
        });
        let deleteToken = database.removeRecord(getToken);
        return deleteToken.do(() => {
            this.state.next(TokenState["unauthorized"]);
            this.loading.onEnd();
        }, () => {
            this.loading.onEnd();
        });
    }

    /**
     * Creates user
     */
    public create(credentials: ICreate) {
        this.loading.onStart();
        let httpResponse = this.http.createUser(Observable.of(credentials));
        return httpResponse.do(() => {
            this.loading.onEnd();
        }, () => {
            this.loading.onEnd();
        });
    }
}