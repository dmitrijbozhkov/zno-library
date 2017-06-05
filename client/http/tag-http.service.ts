import { Http } from "@angular/http";
import { Injectable, Inject } from "@angular/core";
import { Utils } from "../main/utils/utils";

@Injectable()
export class TagHttpService {
    private http: Http;
    private utils: Utils;
    class(@Inject(Http) http: Http, @Inject(Utils) utils: Utils) {
        this.http = http;
        this.utils = utils;
    }
}