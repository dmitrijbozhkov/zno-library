import { Injectable, Inject } from "@angular/core";
import { Http, RequestOptions, Response } from "@angular/http";
import { Utils } from "../main/utils/utils";
import { Observable } from "rxjs";

@Injectable()
export class HistoryHttpService {
    private http: Http;
    private utils: Utils;
    constructor(@Inject(Http) http: Http, @Inject(Utils) utils: Utils) {
        this.http = http;
        this.utils = utils;
    }
}