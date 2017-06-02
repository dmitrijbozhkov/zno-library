import { LoginComponent, errorMessages } from "../login.component";
import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { MdSnackBar } from "@angular/material";
import { Utils, ErrorInput, IErrorMessages, buildInput } from "../../../main/utils/utils";
import { ReactiveFormsModule } from "@angular/forms";
import { AccountService } from "../../services/account.service";
import { Router } from "@angular/router";
import { UIModule } from "../../../main/UI.module";
import { Observable } from "rxjs";

class AccountServiceMock {
    public fromLogin;
    public logIn(values) {
        return this.fromLogin(values);
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

describe("LoginComponent tests", () => {
    let fixture: ComponentFixture<LoginComponent>;
    let account: AccountServiceMock;
    let bar: SnackBarMock;
    let router: RouterMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ ReactiveFormsModule, UIModule ],
            providers: [
                Utils,
                { provide: AccountService, useClass: AccountServiceMock },
                { provide: MdSnackBar, useClass: SnackBarMock },
                { provide: Router, useClass: RouterMock }
            ],
            declarations: [ LoginComponent ]
        });
        fixture = TestBed.createComponent(LoginComponent);
        account = getTestBed().get(AccountService);
        bar = getTestBed().get(MdSnackBar);
        router = getTestBed().get(Router);
    });
    it("emailInput should have errorMessage equal to 'Неправильный email' if value is not emil", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.emailInput.element.setValue("kek");
        expect(component.emailInput.errorMessage).toBe(errorMessages.email);
    });
    it("emailInput should have errorMessage equal to 'Поле обязательно для заполнения' if field not filled", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.emailInput.element.markAsTouched();
        expect(component.emailInput.errorMessage).toBe(errorMessages.required);
    });
    it("passwordInput should have errorMessage equal to 'Поле обязательно для заполнения' if field not filled", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.passwordInput.element.markAsTouched();
        expect(component.passwordInput.errorMessage).toBe(errorMessages.required);
    });
    it("passwordInput should have errorMessage equal to 'Пароль должен быть не менее 6 символов' if less than 6 elements", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.passwordInput.element.setValue("pass");
        expect(component.passwordInput.errorMessage).toBe(errorMessages.minlength);
    });
    it("submitForm should call preventDefault on submit event", (done) => {
        let component = fixture.componentInstance;
        account.fromLogin = () => { };
        component.ngOnInit();
        component.submitForm({ preventDefault: () => { expect(true).toBeTruthy(); done(); } } as any, { email: "kek", password: "lel", remember: false });
    });
    it("submitForm should open snackbar with message 'Авторизация успешна' and action 'Ok' with diration 5000 if form is valid", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromLogin = () => { return Observable.of("kek"); };
        bar.fromDismiss = () => {};
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {
            expect(message).toBe("Авторизация успешна");
            expect(action).toBe("Ok");
            expect(options.duration).toBe(5000);
            done();
        };
        component.emailInput.element.setValue("kek@mail.ru");
        component.passwordInput.element.setValue("pass1234");
        component.submitForm({ preventDefault: () => { } } as any, { email: "kek", password: "lel", remember: false });
    });
    it("submitForm should call dissmiss on snackbar if form is valid", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromLogin = () => { return Observable.of("kek"); };
        bar.fromDismiss = () => { expect(true).toBeTruthy(); done(); };
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {};
        component.emailInput.element.setValue("kek@mail.ru");
        component.passwordInput.element.setValue("pass1234");
        component.submitForm({ preventDefault: () => { } } as any, { email: "kek", password: "lel", remember: false });
    });
    it("submitForm should navigate to home if form is valid", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromLogin = () => { return Observable.of("kek"); };
        bar.fromDismiss = () => {};
        router.fromNavigate = (route) => { expect(route).toEqual([""]); done(); };
        bar.fromOpen = (message, action, options) => {};
        component.emailInput.element.setValue("kek@mail.ru");
        component.passwordInput.element.setValue("pass1234");
        component.submitForm({ preventDefault: () => { } } as any, { email: "kek", password: "lel", remember: false });
    });
    it("submitForm should open snackbar with message 'Ошибка: Неправельный формат емейла' action 'Ok' and duration 5000 if logIn throws error and 'Email is incorrect' error", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromLogin = () => { return Observable.throw({ json: () => { return { error: "Email is incorrect" }; } }); };
        bar.fromDismiss = () => {};
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {
            expect(message).toBe("Ошибка: Неправельный формат емейла");
            expect(action).toBe("Ok");
            expect(options.duration).toBe(5000);
            done();
        };
        component.emailInput.element.setValue("kek@mail.ru");
        component.passwordInput.element.setValue("pass1234");
        component.submitForm({ preventDefault: () => { } } as any, { email: "kek", password: "lel", remember: false });
    });
    it("submitForm should throw error if logIn throws error has error property", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromLogin = () => { return Observable.throw({ error: true, json: () => { return { error: "Email is incorrect" }; } }); };
        bar.fromDismiss = () => {};
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {};
        component.emailInput.element.setValue("kek@mail.ru");
        component.passwordInput.element.setValue("pass1234");
        expect(() => {
            component.submitForm({ preventDefault: () => { } } as any, { email: "kek", password: "lel", remember: false });
        }).toThrowError();
    });
    it("submitForm should reset login if logIn throws error", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromLogin = () => { return Observable.throw({ json: () => { return { error: "Email is incorrect" }; } }); };
        bar.fromDismiss = () => { expect(true).toBeTruthy(); done(); };
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {};
        component.emailInput.element.setValue("kek@mail.ru");
        component.passwordInput.element.setValue("pass1234");
        component.submitForm({ preventDefault: () => { } } as any, { email: "kek", password: "lel", remember: false });
    });
    it("resetForm should call reset on login form", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        spyOn(component.login, "reset").and.callThrough();
        component.resetForm({ preventDefault: () => { } } as any);
    });
    it("resetForm should call preventDefault on event", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.resetForm({ preventDefault: () => { expect(true).toBeTruthy(); done(); } } as any);
    });
});