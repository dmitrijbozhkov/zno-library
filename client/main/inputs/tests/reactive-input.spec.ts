import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { ReactiveInputComponent } from "../reactive-input.component";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { UIModule } from "../../../main/UI.module";
import { Subscription } from "rxjs";

describe("ReactiveInputComponent tests", () => {
    let fixture: ComponentFixture<ReactiveInputComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule, UIModule ],
            declarations: [ ReactiveInputComponent ]
        });
        fixture = TestBed.createComponent(ReactiveInputComponent);
    });
    it("refreshErr should take first error from control and put in errorMessage error from errorList if control is invalid", () => {
        let component = fixture.componentInstance;
        let expected = "Required error";
        component.controlName = "name";
        component.errorList = {
            required: expected
        };
        component.group = new FormBuilder().group({
            name: [ "" ]
        });
        component.ngOnInit();
        component.group.controls["name"].setErrors({
            required: true
        });
        expect(component.errorMessage).toBe(expected);
    });
    it("ngOnInit should set control from FormGroup", () => {
        let component = fixture.componentInstance;
        let builder = new FormBuilder();
        let control = builder.control("");
        component.group = builder.group({
            name: control
        });
        component.controlName = "name";
        component.ngOnInit();
        expect(component.control).toEqual(control);
    });
    it("ngOnInit should set subscription in changes", () => {
        let component = fixture.componentInstance;
        let builder = new FormBuilder();
        let control = builder.control("");
        component.group = builder.group({
            name: control
        });
        component.controlName = "name";
        component.ngOnInit();
        expect(component.changes instanceof Subscription).toBeTruthy();
    });
    it("ngOnInit should subscribe to control statusChanges and call refreshErr", (done) => {
        let component = fixture.componentInstance;
        component.controlName = "name";
        component.group = new FormBuilder().group({
            name: [ "" ]
        });
        component.ngOnInit();
        component.refreshErr = () => { expect(true).toBeTruthy(); done(); };
        component.group.controls["name"].setErrors({
            required: true
        });
    });
    it("ngOnDestroy should set control to null and call unsubscribe on changes", (done) => {
        let component = fixture.componentInstance;
        component.changes = { unsubscribe: () => { expect(true).toBeTruthy(); done(); } } as any;
        component.ngOnDestroy();
        expect(component.control).toEqual(null);
    });
});