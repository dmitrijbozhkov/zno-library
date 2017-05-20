import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { Http } from "@angular/http";

export interface IAccountState {
    isLogged: boolean;
}

@Injectable()
export class AccountService {
    public state: ReplaySubject<IAccountState>;
    public http: Http;
    constructor(http: Http) {
        this.state = new ReplaySubject();
        this.http = http;
        this.initAccount();
    }
    public initAccount() {
        this.state.next({ isLogged: false });
    }
}