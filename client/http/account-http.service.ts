import { Injectable } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { ILoginCredentials, ICreate } from "../account/services/account.service";
import { Utils } from "../main/utils/utils";
import { Observable } from "rxjs";

@Injectable()
export class AccountHttpService {
    constructor(private http: Http, private utils: Utils) {}

    /**
     * Logs in user
     * @param credentials Observable of login credentials
     */
    public loginUser(credentials: Observable<ILoginCredentials>): Observable<Response> {
        let content = this.utils.JsonType();
        let options = new RequestOptions({ headers: content });
        return credentials.map((req) => {
            let response = this.http.post("auth/login/", { email: req.email, password: req.password }, options);
            return response;
        }).concatAll();
    }

    /**
     * Creates new user
     * @param credentials Observable of create credentials
     */
    public createUser(credentials: Observable<ICreate>) {
        let content = this.utils.JsonType();
        let options = new RequestOptions({ headers: content });
        return credentials.map((req) => {
            let response = this.http.post("auth/create/", req, options);
            return response;
        }).concatAll();
    }
}