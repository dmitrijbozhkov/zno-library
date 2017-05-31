import { Injectable, Inject } from "@angular/core";
import { AddCourseHttpService } from "../../http/http.module";
import { DatabaseService } from "../../database/database.service";
import { Observable } from "rxjs";

Injectable()
export class AddCourseService {
    private http: AddCourseHttpService;
    private database: DatabaseService;
    constructor(@Inject(AddCourseHttpService) http: AddCourseHttpService, @Inject(DatabaseService) database: DatabaseService) {
        this.http = http;
        this.database = database;
    }
}