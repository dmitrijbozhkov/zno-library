import { Injectable, Inject } from "@angular/core";
import { HistoryHttpService } from "../../http/http.module";
import { DatabaseService } from "../../database/database.service";
import { Observable } from "rxjs";

export interface ICourseHistory {
    courseName: string;
    completed: number;
    courseId: string;
}

@Injectable()
export class HistoryService {
    private http: HistoryHttpService;
    private database: DatabaseService;
    constructor(@Inject(HistoryHttpService) http: HistoryHttpService, @Inject(DatabaseService) database: DatabaseService) {
        this.http = http;
        this.database = database;
    }

    /**
     * Returns latest user history
     */
    latestHsitory(pageNo: number, perPage: number): Observable<ICourseHistory[]> {
        return Observable.of([
            { courseName: "Intro to calculus", completed: 50, courseId: "sadadasdxccvdf" },
            { courseName: "How to code", completed: 10, courseId: "asdcvgdghfgn" }
        ]);
    }
}