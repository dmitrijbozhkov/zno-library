import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { ILogin, ICreate } from "../account/services/account.service";
import { Observable } from "rxjs";

@Injectable()
export class AccountHttpService {
    constructor(private http: Http) {}

    /**
     * Logs in user
     * @param credentials Observable of login credentials
     */
    public loginUser(credentials: Observable<ILogin>) {
        let type = new Headers({ "Content-Type": "application/json" });
    }

    /**
     * Creates new user
     * @param credentials Observable of create credentials
     */
    public createUser(credentials: Observable<ICreate>) {}
}