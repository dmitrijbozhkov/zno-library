import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { MdSnackBar, MdDialog, MdDialogRef, MD_DIALOG_DATA } from "@angular/material";
import { ITag } from "../../course/add-course-tag.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CreateTagDialog, CreateTagOptions } from "../create-tag.component";
import { UIModule } from "../../../../main/UI.module";

class DialogRefMock {
    public fromClose;
    public close(val) { return this.fromClose(val); }
}

describe("CreateTagDialog tests", () => {
    let fixture: ComponentFixture<CreateTagDialog>;
    let dialog:  DialogRefMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule, UIModule ],
            providers: [
                { provide: MdDialogRef, useClass: DialogRefMock },
                { provide: MD_DIALOG_DATA, useValue: "" }
            ],
            declarations: [ CreateTagDialog ]
        });
        fixture = TestBed.createComponent(CreateTagDialog);
        dialog = getTestBed().get(MdDialogRef);
    });
    it("submitTag should call dialog.close and pass value of tagName and 'Submit' action", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        let expected = { name: "super tag", action: CreateTagOptions[0] };
        component.addTag.controls.tagName.setValue(expected.name);
        dialog.fromClose = (actual) => { expect(actual).toEqual(expected); done(); };
        component.submitTag();
    });
    it("cancelTag should call dialog.close and pass 'Cancel' action", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        let expected = { action: CreateTagOptions[1] };
        dialog.fromClose = (actual) => { expect(actual).toEqual(expected); done(); };
        component.cancelTag();
    });
});