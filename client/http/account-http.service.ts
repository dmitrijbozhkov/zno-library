import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

export interface IInitials {
    email: string;
    password: string;
}

@Injectable()
export class AccountHttpService {
    constructor(private http: Http) {}
    public authorize(initials: IInitials) {
    }
}