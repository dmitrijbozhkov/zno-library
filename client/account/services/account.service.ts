import { Injectable, Inject } from "@angular/core";
import { ReplaySubject, Observable } from "rxjs";
import { Http } from "@angular/http";
import { AccountDatabaseService } from "../../database/database.module";
import { AccountHttpService } from "../../http/http.module";
import { JwtHelper } from "angular2-jwt";

export interface IAccountToken {
    expires?: Date;
    token?: string;
    roles?: string[];
}

export enum TokenState {
    "pending",
    "unauthorized",
    "authorized"
}

@Injectable()
export class AccountService {
    public state: ReplaySubject<TokenState>;
    public token: IAccountToken;
    public http: AccountHttpService;
    public database: AccountDatabaseService;
    public jwtHelper: JwtHelper;
    constructor(@Inject(AccountDatabaseService) database: AccountDatabaseService, @Inject(AccountHttpService) http: AccountHttpService) {
        this.state = new ReplaySubject();
        this.http = http;
        this.database = database;
        this.token = {};
        this.initAccount();
    }
    /**
     * Initializes account service
     */
    public initAccount() {
        this.state.next(TokenState["pending"]);
        this.jwtHelper = new JwtHelper();
        this.database.initDb();
        this.checkAuth();
    }
    /**
     * Checks if user is logged in
     */
    public checkAuth() {
        this.database.getToken().subscribe((response) => {
            console.log(this.decodeToken(""));
            if (response.error) {
                this.state.next(TokenState["unauthorized"]);
            } else {
            }
        });
    }

    public decodeToken(token: string) {
        let decoded = this.jwtHelper.decodeToken("WyIyIiwiNmEzMDcwMDI3MDkwNDM5MTQ1YTQ4YzJmODk0MzlhOWIiXQ.DAMOHg.T4eALlfFgNi0ux-J8IYQMMlIBB8");
        return decoded;
    }
}