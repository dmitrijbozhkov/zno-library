import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { AddCourseHttpService } from "../add-course-http.service";
import { Http, BaseRequestOptions, XHRBackend, ResponseOptions, Response, Headers } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Utils } from "../../main/utils/utils";
import { Observable } from "rxjs";

describe("AddCourseHttpService tests", () => {
    let service: AddCourseHttpService;
    let backend: MockBackend;
    beforeEach(async(() => {
        TestBed.configureTestingModule({ providers: [
            AddCourseHttpService,
            Utils,
            BaseRequestOptions,
            MockBackend,
            {
                provide: Http,
                deps: [ MockBackend, BaseRequestOptions ],
                useFactory: function(backend: XHRBackend, defaultOptions: BaseRequestOptions) {
                    return new Http(backend, defaultOptions);
                }
            }]
        });
        let bed = getTestBed();
        service = bed.get(AddCourseHttpService);
        backend = bed.get(MockBackend);
    }));
    it("should be created");
});