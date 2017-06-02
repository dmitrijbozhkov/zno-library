import { CreateUserComponent, infoErrorMessages, accErrorMessages } from "../create.component";
import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { MdSnackBar } from "@angular/material";
import { Utils, ErrorInput, IErrorMessages, buildInput } from "../../../main/utils/utils";
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
    it("nameInput should have errorMessage equal to 'Поле обязательно для заполнения' if field is not filled", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.nameInput.element.markAsDirty()
        expect(component.nameInput.errorMessage).toBe(infoErrorMessages.required);
    });
    it("surnameInput should have errorMessage equal to 'Поле обязательно для заполнения' if field is not filled", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.surnameInput.element.markAsDirty();
        expect(component.surnameInput.errorMessage).toBe(infoErrorMessages.required);
    });
    it("lastNameInput should have errorMessage equal to 'Поле обязательно для заполнения' if field is not filled", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.lastNameInput.element.markAsDirty();
        expect(component.lastNameInput.errorMessage).toBe(infoErrorMessages.required);
    });
    it("emailInput should have errorMessage equal to 'Поле обязательно для заполнения' if field is not filled", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.emailInput.element.markAsDirty();
        expect(component.emailInput.errorMessage).toBe(infoErrorMessages.required);
    });
    it("passwordInput should have errorMessage equal to 'Поле обязательно для заполнения' if field is not filled", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.passwordInput.element.markAsDirty();
        expect(component.passwordInput.errorMessage).toBe(infoErrorMessages.required);
    });
    it("repeatPasswordInput should have errorMessage equal to 'Поле обязательно для заполнения' if field is not filled", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.repeatPasswordInput.element.markAsDirty();
        expect(component.repeatPasswordInput.errorMessage).toBe(infoErrorMessages.required);
    });
    it("nameInput should have errorMessage equal to 'Не более 40 сиволов' if more than 40 characters passed", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.nameInput.element.setValue("asdfghjkloiuytrewqasdfghjkl,mnbvcxzaqwertyuiok");
        expect(component.nameInput.errorMessage).toBe(infoErrorMessages.maxlength);
    });
    it("surnameInput should have errorMessage equal to 'Не более 40 сиволов' if more than 40 characters passed", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.surnameInput.element.setValue("asdfghjkloiuytrewqasdfghjkl,mnbvcxzaqwertyuiok");
        expect(component.surnameInput.errorMessage).toBe(infoErrorMessages.maxlength);
    });
    it("lastNameInput should have errorMessage equal to 'Не более 40 сиволов' if more than 40 characters passed", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.lastNameInput.element.setValue("asdfghjkloiuytrewqasdfghjkl,mnbvcxzaqwertyuiok");
        expect(component.lastNameInput.errorMessage).toBe(infoErrorMessages.maxlength);
    });
    it("emailInput should have errorMessage equal to 'Неправильный email' if value is not email", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.emailInput.element.setValue("pepe");
        expect(component.emailInput.errorMessage).toBe(accErrorMessages.email);
    });
    it("passwordInput should have errorMessage equal to 'Пароль должен быть не менее 6 символов' if value is less than 6 characters long", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.passwordInput.element.setValue("pepe");
        expect(component.passwordInput.errorMessage).toBe(accErrorMessages.minlength);
    });
    it("repeatPasswordInput should have errorMessage equal to 'Пароль должен быть не менее 6 символов' if value is less than 6 characters long", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.repeatPasswordInput.element.setValue("pepe");
        expect(component.repeatPasswordInput.errorMessage).toBe(accErrorMessages.minlength);
    });
    it("repeatPasswordInput should have errorMessage equal to 'Пароли должны совпадать' if value is not equal to value of passwordInput", () => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        component.passwordInput.element.setValue("lelepeps");
        component.repeatPasswordInput.element.setValue("pepeasdasd");
        expect(component.repeatPasswordInput.errorMessage).toBe(accErrorMessages.sameFields);
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
        component.nameInput.element.setValue(legalForm.name);
        component.surnameInput.element.setValue(legalForm.surname);
        component.lastNameInput.element.setValue(legalForm.lastName);
        component.emailInput.element.setValue(legalForm.email);
        component.passwordInput.element.setValue(legalForm.password);
        component.repeatPasswordInput.element.setValue(legalForm.repeatPassword);
        component.submitForm({ preventDefault: () => { } } as any, legalForm);
    });
    it("submitForm should call dissmiss on snackbar if form is valid", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromCreate = () => { return Observable.of("kek"); };
        bar.fromDismiss = () => { expect(true).toBeTruthy(); done(); };
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {};
        component.nameInput.element.setValue(legalForm.name);
        component.surnameInput.element.setValue(legalForm.surname);
        component.lastNameInput.element.setValue(legalForm.lastName);
        component.emailInput.element.setValue(legalForm.email);
        component.passwordInput.element.setValue(legalForm.password);
        component.repeatPasswordInput.element.setValue(legalForm.repeatPassword);
        component.submitForm({ preventDefault: () => { } } as any, legalForm);
    });
    it("submitForm should navigate to home if form is valid", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromCreate = () => { return Observable.of("kek"); };
        bar.fromDismiss = () => {};
        router.fromNavigate = (route) => { expect(route).toEqual(["user", "login"]); done(); };
        bar.fromOpen = (message, action, options) => {};
        component.nameInput.element.setValue(legalForm.name);
        component.surnameInput.element.setValue(legalForm.surname);
        component.lastNameInput.element.setValue(legalForm.lastName);
        component.emailInput.element.setValue(legalForm.email);
        component.passwordInput.element.setValue(legalForm.password);
        component.repeatPasswordInput.element.setValue(legalForm.repeatPassword);
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
        component.nameInput.element.setValue(legalForm.name);
        component.surnameInput.element.setValue(legalForm.surname);
        component.lastNameInput.element.setValue(legalForm.lastName);
        component.emailInput.element.setValue(legalForm.email);
        component.passwordInput.element.setValue(legalForm.password);
        component.repeatPasswordInput.element.setValue(legalForm.repeatPassword);
        component.submitForm({ preventDefault: () => { } } as any, legalForm);
    });
    it("submitForm should reset create if create throws error", (done) => {
        let component = fixture.componentInstance;
        component.ngOnInit();
        account.fromCreate = () => { return Observable.throw({ json: () => { return { error: "Email is incorrect" }; } }); };
        bar.fromDismiss = () => { expect(true).toBeTruthy(); done(); };
        router.fromNavigate = () => {};
        bar.fromOpen = (message, action, options) => {};
        component.nameInput.element.setValue(legalForm.name);
        component.surnameInput.element.setValue(legalForm.surname);
        component.lastNameInput.element.setValue(legalForm.lastName);
        component.emailInput.element.setValue(legalForm.email);
        component.passwordInput.element.setValue(legalForm.password);
        component.repeatPasswordInput.element.setValue(legalForm.repeatPassword);
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