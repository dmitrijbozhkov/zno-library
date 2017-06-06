import { FileInputComponent } from "../file-input.component";
import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { UIModule } from "../../../main/UI.module";

describe("FileInputComponent tests", () => {
    let fixture: ComponentFixture< FileInputComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule, UIModule ],
            declarations: [  FileInputComponent ]
        });
        fixture = TestBed.createComponent(FileInputComponent);
    });
    it("ngOnInit should set value to object with length property equal to 0", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        expect(component.value).toEqual({ length: 0 });
    });
    it("onChange should set value to passed object target.files property", () => {
        let component = fixture.componentInstance;
        let expected = { length: 1 };
        let event = { target: { files: expected } } as any;
        component.propagateChange = () => {};
        component.onChange(event);
        expect(component.value).toEqual(expected);
    });
    it("onChange should call propagetChange and pass value", (done) => {
        let component = fixture.componentInstance;
        let expected = { length: 1 };
        let event = { target: { files: expected } } as any;
        component.propagateChange = (actual) => {
            expect(actual).toEqual(expected);
            done();
        };
        component.onChange(event);
    });
    it("onLoad should call on input.nativeElement click property", (done) => {
        let component = fixture.componentInstance;
        component.input = { nativeElement: { click: () => {
            expect(true).toBeTruthy();
            done();
        } } };
        component.onload({ preventDefault: () => {} } as any);
    });
    it("onCancel should set input.nativeElements vale to ''", () => {
        let component = fixture.componentInstance;
        component.input = { nativeElement: { value: "kek" } };
        component.onCancel({ preventDefault: () => {} } as any);
        expect(component.input.nativeElement.value).toBe("");
    });
    it("writeValue should set value to passed value", () => {
        let component = fixture.componentInstance;
        let expected = { "0": "lel", length: 1 };
        component.writeValue(expected as any);
        expect(component.value).toEqual(expected as any);
    });
    it("registerOnChange should set propagateChange functon to passed function", () => {
        let component = fixture.componentInstance;
        let expected = (val) => { return val + 1; };
        component.registerOnChange(expected);
        expect(component.propagateChange).toEqual(expected);
    });
    it("validate should return empty object", () => {
        let component = fixture.componentInstance;
        let expected = {};
        let actual = component.validate({} as any);
        expect(actual).toEqual(expected);
    });
});