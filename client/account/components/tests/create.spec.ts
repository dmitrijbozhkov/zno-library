import { CreateUserComponent, infoErrorMessages, accErrorMessages } from "../create.component";
import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { MdSnackBar } from "@angular/material";
import { Utils} from "../../../main/utils/utils";
import { ReactiveFormsModule } from "@angular/forms";
import { AccountService } from "../../services/account.service";
import { Router } from "@angular/router";
import { UIModule } from "../../../main/UI.module";
import { Observable } from "rxjs";

class AccountServiceMock {
    public fromCreate;
    public create(values) {
        return this.fromCreate(values);
    }
}
class SnackBarMock {
    public fromDismiss;
    public fromOpen;
    public dismiss(param) { return this.fromDismiss(param); }
    public open(message, action, options) { return this.fromOpen(message, action, options); }
}
class RouterMock {
    public fromNavigate;
    public navigate(path) { return this.fromNavigate(path); }
}

describe("CreateUserComponent tests", () => {
    let fixture: ComponentFixture<CreateUserComponent>;
    let account: AccountServiceMock;
    let bar: SnackBarMock;
    let router: RouterMock;
    let legalForm = {
            name: "Dima",
            surname: "Bozhkov",
            lastName: "Vyacheslavovich",
            email: "kek@mail.ru",
            password: "pass1234",
            repeatPassword: "pass1234"
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule, UIModule ],
            providers: [
                Utils,
                { provide: AccountService, useClass: AccountServiceMock },
                { provide: MdSnackBar, useClass: SnackBarMock },
                { provide: Router, useClass: RouterMock }
            ],
            declarations: [ CreateUserComponent ]
        });
        fixture = TestBed.createComponent(CreateUserComponent);
        account = getTestBed().get(AccountService);
        bar = getTestBed().get(MdSnackBar);
        router = getTestBed().get(Router);
    });
    it("submitForm should call preventDefault on submit event", (done) => {
        let component = fixture.componentInstance;
        account.fromCreate = () => { };
        component.ngOnInit();
        component.submitForm({ preventDefault: () => { expect(true).toBeTruthy(); done(); } } as any, { email: "kek", password: "lel", remember: false });
    });
    it("submitForm should open snackbar with message 'Аккаунт создан' and action 'Ok' with diration 5000 if form is valid", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromCreate = () => { return Observable.of("kek"); };
        bar.fromDismiss = () => {};
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {
            expect(message).toBe("Аккаунт создан");
            expect(action).toBe("Ok");
            expect(options.duration).toBe(5000);
            done();
        };
        component.create.controls.name.setValue(legalForm.name);
        component.create.controls.surname.setValue(legalForm.surname);
        component.create.controls.lastName.setValue(legalForm.lastName);
        component.create.controls.email.setValue(legalForm.email);
        component.create.controls.password.setValue(legalForm.password);
        component.create.controls.repeatPassword.setValue(legalForm.repeatPassword);
        component.submitForm({ preventDefault: () => { } } as any, legalForm);
    });
    it("submitForm should call dissmiss on snackbar if form is valid", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromCreate = () => { return Observable.of("kek"); };
        bar.fromDismiss = () => { expect(true).toBeTruthy(); done(); };
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {};
        component.create.controls.name.setValue(legalForm.name);
        component.create.controls.surname.setValue(legalForm.surname);
        component.create.controls.lastName.setValue(legalForm.lastName);
        component.create.controls.email.setValue(legalForm.email);
        component.create.controls.password.setValue(legalForm.password);
        component.create.controls.repeatPassword.setValue(legalForm.repeatPassword);
        component.submitForm({ preventDefault: () => { } } as any, legalForm);
    });
    it("submitForm should navigate to home if form is valid", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromCreate = () => { return Observable.of("kek"); };
        bar.fromDismiss = () => {};
        router.fromNavigate = (route) => { expect(route).toEqual(["user", "login"]); done(); };
        bar.fromOpen = (message, action, options) => {};
        component.create.controls.name.setValue(legalForm.name);
        component.create.controls.surname.setValue(legalForm.surname);
        component.create.controls.lastName.setValue(legalForm.lastName);
        component.create.controls.email.setValue(legalForm.email);
        component.create.controls.password.setValue(legalForm.password);
        component.create.controls.repeatPassword.setValue(legalForm.repeatPassword);
        component.submitForm({ preventDefault: () => { } } as any, legalForm);
    });
    it("submitForm should open snackbar with message 'Ошибка: Неправельный формат емейла' action 'Ok' and duration 5000 if create throws error and 'Email is incorrect' error", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromCreate = () => { return Observable.throw({ json: () => { return { error: "Email is incorrect" }; } }); };
        bar.fromDismiss = () => {};
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {
            expect(message).toBe("Ошибка: Неправельный формат емейла");
            expect(action).toBe("Ok");
            expect(options.duration).toBe(5000);
            done();
        };
        component.create.controls.name.setValue(legalForm.name);
        component.create.controls.surname.setValue(legalForm.surname);
        component.create.controls.lastName.setValue(legalForm.lastName);
        component.create.controls.email.setValue(legalForm.email);
        component.create.controls.password.setValue(legalForm.password);
        component.create.controls.repeatPassword.setValue(legalForm.repeatPassword);
        component.submitForm({ preventDefault: () => { } } as any, legalForm);
    });
    it("submitForm should reset create if create throws error", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromCreate = () => { return Observable.throw({ json: () => { return { error: "Email is incorrect" }; } }); };
        bar.fromDismiss = () => { expect(true).toBeTruthy(); done(); };
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {};
        component.create.controls.name.setValue(legalForm.name);
        component.create.controls.surname.setValue(legalForm.surname);
        component.create.controls.lastName.setValue(legalForm.lastName);
        component.create.controls.email.setValue(legalForm.email);
        component.create.controls.password.setValue(legalForm.password);
        component.create.controls.repeatPassword.setValue(legalForm.repeatPassword);
        component.submitForm({ preventDefault: () => { } } as any, legalForm);
    });
    it("resetForm should call reset on create form", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        spyOn(component.create, "reset").and.callThrough();
        component.resetForm({ preventDefault: () => { } } as any);
    });
    it("resetForm should call preventDefault on event", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.resetForm({ preventDefault: () => { expect(true).toBeTruthy(); done(); } } as any);
    });
});