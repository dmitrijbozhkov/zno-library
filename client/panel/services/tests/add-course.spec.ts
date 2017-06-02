import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { AddCourseService } from "../add-course.service";
import { AddCourseHttpService } from "../../../http/http.module";
import { DatabaseService } from "../../../database/database.service";
import { Observable } from "rxjs";

class AddCourseHttpMock {}
class DatabaseServiceMock {}

describe("AddCourseService tests", () => {
    let service: AddCourseService;
    let http: AddCourseHttpMock;
    let database: DatabaseServiceMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AddCourseService,
                { provide: AddCourseHttpService, useClass: AddCourseHttpMock },
                { provide: DatabaseService, useClass: DatabaseServiceMock }
            ]
        });
        let bed = getTestBed();
        service = bed.get(AddCourseService);
        http = bed.get(AddCourseHttpService);
        database = bed.get(DatabaseService);
    });
    it("should be created");
});