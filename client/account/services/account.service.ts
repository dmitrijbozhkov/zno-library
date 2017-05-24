import { Injectable, Inject } from "@angular/core";
import { ReplaySubject, Observable } from "rxjs";
import { Http } from "@angular/http";
import { DatabaseService, DatabaseClient, IUserDoc } from "../../database/database.module";
import { AccountHttpService } from "../../http/http.module";

/**
 * Data for logging in user
 */
export interface ILogin {
    email: string;
    password: string;
    rememberMe: boolean;
}

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
 * States of account
 */
export enum TokenState {
    "pending",
    "unauthorized",
    "authorized"
}

@Injectable()
export class AccountService {
    public state: ReplaySubject<TokenState>;
    public http: AccountHttpService;
    public database: DatabaseService;
    constructor(@Inject(DatabaseService) database: DatabaseService, @Inject(AccountHttpService) http: AccountHttpService) {
        this.state = new ReplaySubject();
        this.http = http;
        this.database = database;
        this.initAccount();
    }

    /**
     * Initializes account service
     */
    public initAccount() {
        this.state.next(TokenState["pending"]);
        this.database.addDatabase("user");
        this.checkAuth().subscribe((response) => {
            this.state.next(response);
        });
    }

    /**
     * Checks if user is logged in
     */
    public checkAuth() {
        return this.database.getDatabase("user").getRecord(Observable.of(["token", {}]))
        .map((res) => {
            if (res.error) {
                return TokenState["unauthorized"];
            } else {
                return TokenState["authorized"];
            }
        });
    }

    /**
     * Logs in user
     */
    public logIn() {}
    /**
     * Logs off user
     */
    public logOff() {}
    /**
     * Creates user
     */
    public create() {}
}