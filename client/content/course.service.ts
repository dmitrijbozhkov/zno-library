import { Injectable, Inject } from "@angular/core";
import { IDatabaseError, IDatabaseRecord, databaseOptions } from "../database/interfaces";

export interface ICourseDoc extends IDatabaseRecord {
    name: string;
    contents: string;
    postTime: Date;
}

@Injectable()
export class CourseService {}