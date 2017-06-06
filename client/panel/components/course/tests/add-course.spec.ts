import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { AddCourseComponent, errList } from "../add-course.component";
import { AddCourseService } from "../../../services/add-course.service";
import { ReactiveFormsModule } from "@angular/forms";
import { UIModule } from "../../../../main/UI.module";
import { Utils } from "../../../../main/utils/utils";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Observable } from "rxjs";
import { InputsModule } from "../../../../main/inputs.module";

class AddMock {
    public fromAddCourse;
    public addCourseName(name) { return this.fromAddCourse(name); }
}

describe("AddCourseComponent tests", () => {
    let fixture: ComponentFixture<AddCourseComponent>;
    let add: AddMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule, UIModule, InputsModule ],
            providers: [
                Utils,
                { provide: AddCourseService, useClass: AddMock }
            ],
            declarations: [ AddCourseComponent ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
        });
        fixture = TestBed.createComponent(AddCourseComponent);
        add = getTestBed().get(AddCourseService);
    });
    it("checkCourseName should add message 'Название курса свободно' if managers addCourseName returns response", (done) => {
        let component = fixture.componentInstance;
        add.fromAddCourse = () => { done(); return Observable.of("kek"); };
        component.ngOnInit();
        component.addCourse.controls.name.setValue("thing");
        component.checkCourseName();
        expect(component.nameIsValid).toEqual([ "Название курса свободно" ]);
    });
    it("checkCourseName should remove message if managers addCourseName returns error", (done) => {
        let component = fixture.componentInstance;
        add.fromAddCourse = () => { done(); return Observable.throw("kek"); };
        component.ngOnInit();
        component.addCourse.controls.name.setValue("thing");
        component.checkCourseName();
        expect(component.nameIsValid).toEqual([]);
    });
});