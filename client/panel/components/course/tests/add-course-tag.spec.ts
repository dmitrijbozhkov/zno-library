import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { AddCourseTagComponent } from "../add-course-tag.component";
import { Utils } from "../../../../main/utils/utils";
import { AddCourseService } from "../../../services/add-course.service";
import { ReactiveFormsModule } from "@angular/forms";
import { UIModule } from "../../../../main/UI.module";
import { Observable } from "rxjs";
import { MdDialog } from "@angular/material";
import { CreateTagDialog, CreateTagOptions } from "../../tag/create-tag.component";

class AddMock {
    public fromGet;
    public courseTags = [];
    public fromAdd;
    public getTags() {
        return this.fromGet();
    }
    public addTag(name) {
        return this.fromAdd(name);
    }
}

class DialogMock {
    public fromOpen;
    public fromAfterClosed;
    public open(component, options) {
        return this.fromOpen(component, options);
    }
    public afterClosed() {
        return this.fromAfterClosed();
    }
}

describe("AddCourseTagComponent tests", () => {
    let fixture: ComponentFixture<AddCourseTagComponent>;
    let add: AddMock;
    let dialog: DialogMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule, UIModule ],
            providers: [
                Utils,
                { provide: AddCourseService, useClass: AddMock },
                { provide: MdDialog, useClass: DialogMock }
            ],
            declarations: [ AddCourseTagComponent, CreateTagDialog ]
        });
        fixture = TestBed.createComponent(AddCourseTagComponent);
        add = getTestBed().get(AddCourseService);
        dialog = getTestBed().get(MdDialog);
    });
    it("openTagMenu should call preventDefault on event", (done) => {
        let component = fixture.componentInstance;
        add.fromGet = () => { return Observable.never(); };
        component.openTagMenu({ preventDefault: () => { expect(true).toBeTruthy(); done(); } } as any);
    });
    it("openTagMenu should call getTags on tagManager and subscribe to response", (done) => {
        let component = fixture.componentInstance;
        add.fromGet = () => { expect(true).toBeTruthy(); done(); return Observable.never();  };
        component.openTagMenu({ preventDefault: () => {  } } as any);
    });
    it("openTagMenu should put response tags from getTags to avalibleTags array", () => {
        let expected = [ { id: 1, name: "Math" }, { id: 2, name: "Literature" } ];
        let component = fixture.componentInstance;
        add.fromGet = () => { return Observable.of(expected); };
        component.openTagMenu({ preventDefault: () => { } } as any);
        expect(component.selectTags).toEqual(expected);
    });
    it("openTagMenu should put tags into avalibleTags array and remove those that have same ids with courseTags", () => {
        let expected = [ { id: 1, name: "Math" }, { id: 2, name: "Literature" } ];
        let component = fixture.componentInstance;
        component.manager.courseTags = [ expected[0] ];
        add.fromGet = () => { return Observable.of(expected); };
        component.openTagMenu({ preventDefault: () => { } } as any);
        expect(component.selectTags).toEqual([ expected[1] ]);
    });
    it("addTag should add tag drom tags array to courseTags", () => {
        let expected = [ { id: 1, name: "Math" }];
        let component = fixture.componentInstance;
        component.addTag(expected[0]);
        expect(component.manager.courseTags).toEqual(expected);
    });
    it("clearTagSearch should clear value of search field", () => {
        let component = fixture.componentInstance;
        let event = { target: { value: "search" } };
        component.clearTagSearch(event as any);
        expect(event.target.value).toBe("");
    });
    it("pushSearch should put into selectTags field only those tags that match query", () => {
        let component = fixture.componentInstance;
        let expected = { id: 1, name: "Math" };
        add.fromGet = () => { return Observable.of([ expected, { id: 2, name: "Literature" } ]); };
        component.openTagMenu({ preventDefault: () => { } } as any);
        component.pushSearch({ target: { value: "ma" } } as any);
        expect(component.selectTags).toEqual([ expected ]);
    });
    it("removeTag should remove passed tag from courseTags", () => {
        let component = fixture.componentInstance;
        let records = [ { id: 1, name: "Math" }, { id: 2, name: "Literature" }, { id: 3, name: "History" }, { id: 4, name: "Philosophy" }, { id: 5, name: "Psychology" } ];
        component.searchTags = records;
        component.manager.courseTags = [ records[0], records[3], records[4] ];
        component.selectTags = [ records[1], records[2] ];
        component.removeTag(records[3]);
        expect(component.manager.courseTags).toEqual([ records[0], records[4] ]);
    });
    it("removeTag should add passed tag to selectTags", () => {
        let component = fixture.componentInstance;
        let records = [ { id: 1, name: "Math" }, { id: 2, name: "Literature" }, { id: 3, name: "History" }, { id: 4, name: "Philosophy" }, { id: 5, name: "Psychology" } ];
        component.searchTags = records;
        component.manager.courseTags = [ records[0], records[3], records[4] ];
        component.selectTags = [ records[1], records[2] ];
        component.removeTag(records[3]);
        expect(component.selectTags).toEqual([ records[1], records[2], records[3] ]);
    });
    it("newTag should open dialog with CreateTagDialog component and pass data with ''", (done) => {
        let component = fixture.componentInstance;
        dialog.fromOpen = (comp, options) => {
            expect(comp).toBeDefined();
            expect(options).toEqual({ data: "" });
            done();
            return dialog;
        };
        dialog.fromAfterClosed = () => { return Observable.never(); };
        component.newTag({} as any);
    });
    it("newTag should subscribe to dialog afterClosed", (done) => {
        let component = fixture.componentInstance;
        dialog.fromOpen = () => {
            return dialog;
        };
        dialog.fromAfterClosed = () => { return { subscribe: (func) => {
            expect(func).toBeDefined();
            done();
        } }; };
        component.newTag({} as any);
    });
    it("newTag should call addTAg on manager if action was 0 and pass name of the tag", (done) => {
        let component = fixture.componentInstance;
        dialog.fromOpen = () => {
            return dialog;
        };
        let expected = "Super tag";
        dialog.fromAfterClosed = () => { return Observable.of({ action: CreateTagOptions[0], name: expected }); };
        add.fromAdd = (name) => {
            expect(name).toBe(expected);
            done();
        };
        component.newTag({} as any);
    });
});