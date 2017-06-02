import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { AddCourseComponent } from "../add-course.component";
import { Utils, ErrorInput, IErrorMessages, buildInput } from "../../../../main/utils/utils";
import { AddCourseService } from "../../../services/add-course.service";
import { ReactiveFormsModule } from "@angular/forms";
import { UIModule } from "../../../../main/UI.module";

class AddMock {}

describe("AddCourseComponent tests", () => {
    let fixture: ComponentFixture<AddCourseComponent>;
    let add: AddMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule, UIModule ],
            providers: [
                Utils,
                { provide: AddCourseService, useClass: AddMock },
            ],
            declarations: [ AddCourseComponent ]
        });
        fixture = TestBed.createComponent(AddCourseComponent);
        add = getTestBed().get(AddCourseService);
    });
    it("nameInput should have errorMessage equal to 'Поле обязательно для заполнения' if field is empty");
    it("");
});