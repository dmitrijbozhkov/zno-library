import { Injectable, Inject } from "@angular/core";
import { CourseHttpService, TagHttpService } from "../../http/http.module";
import { LoadingService } from "../../main/load/loading.service";
import { Observable } from "rxjs";
import { ITag } from "../components/course/add-course-tag.component";
import { DatabaseService } from "../../database/database.module";

@Injectable()
export class AddCourseService {
    private http: CourseHttpService;
    private load: LoadingService;
    private tag: TagHttpService;
    private database: DatabaseService;
    private courseName: string;
    public courseTags: ITag[];
    constructor(@Inject(CourseHttpService) http: CourseHttpService, @Inject(TagHttpService) tag: TagHttpService, @Inject(LoadingService) loading: LoadingService, @Inject(DatabaseService) database: DatabaseService) {
        this.http = http;
        this.load = loading;
        this.tag = tag;
        this.database = database;
        this.courseTags = [];
    }

    /**
     * Creates id for course
     * @param name Course name
     */
    public addCourseName(name: string) {
        console.log(name);
        return Observable.of("valid");
    }

    /**
     * Gets list of all the tags from database
     */
    public getTags() {
        return Observable.of([ { id: 1, name: "Math" }, { id: 2, name: "Literature" }, { id: 3, name: "History" }, { id: 4, name: "Philosophy" }, { id: 5, name: "Psychology" } ]);
    }

    /**
     * Adds new tag
     * @param name Tag name
     */
    public addTag(name: string) {
        console.log("add", name);
    }
}