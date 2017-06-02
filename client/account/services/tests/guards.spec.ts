import { AccountService } from "../account.service";
import { Observable } from "rxjs";
import { MdSnackBar } from "@angular/material";
import { TestBed, async, getTestBed, ComponentFixture } from "@angular/core/testing";
import { AdminGuard } from "../adminGuard.service";
import { LoginGuard } from "../loginGuard.service";
import { TeacherGuard } from "../teacherGuard.service";

class AccountServiceMock {
    public fromCheck;
    public checkAuth() { return this.fromCheck(); }
}
class SnackbarMock {
    public fromOpen;
    public open(message, action, options) { return this.fromOpen(message, action, options); }
    public dismiss() {}
}

describe("AdminGuard tests", () => {
    let guard: AdminGuard;
    let account: AccountServiceMock;
    let snackbar: SnackbarMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MdSnackBar, useClass: SnackbarMock },
                { provide: AccountService, useClass: AccountServiceMock },
                AdminGuard
            ]
        });
        let bed = getTestBed();
        guard = bed.get(AdminGuard);
        account = bed.get(AccountService);
        snackbar = bed.get(MdSnackBar);
    });
    it("canActivate should return true if roles array has 'Admin'", (done) => {
        account.fromCheck = () => { return Observable.of({ roles: [ "Admin" ] }); };
        guard.canActivate().subscribe((actual) => {
            expect(actual).toBeTruthy();
            done();
        });
    });
    it("canActivate should return false if roles arra doesn't have 'Admin'", (done) => {
        account.fromCheck = () => { return Observable.of({ roles: [  ] }); };
        guard.canActivate().subscribe((actual) => {
            expect(!actual).toBeTruthy();
            done();
        });
    });
    it("canActivate should open snackbar with message 'Вы не авторизованы', action 'Ok' and duration 5000 if checkAuth throws error", (done) => {
        account.fromCheck = () => { return Observable.throw({}); };
        snackbar.fromOpen = (message, action, options) => {
            expect(message).toBe("Вы не авторизованы");
            expect(action).toBe("Ok");
            expect(options.duration).toBe(5000);
            done();
        };
        guard.canActivate().subscribe();
    });
    it("canActivate should return false if checkAuth throws error", (done) => {
        account.fromCheck = () => { return Observable.throw({}); };
        snackbar.fromOpen = (message, action, options) => {};
        guard.canActivate().subscribe((actual) => {
            expect(!actual).toBeTruthy();
            done();
        });
    });
});

describe("LoginGuard tests", () => {
    let guard: LoginGuard;
    let account: AccountServiceMock;
    let snackbar: SnackbarMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MdSnackBar, useClass: SnackbarMock },
                { provide: AccountService, useClass: AccountServiceMock },
                LoginGuard
            ]
        });
        let bed = getTestBed();
        guard = bed.get(LoginGuard);
        account = bed.get(AccountService);
        snackbar = bed.get(MdSnackBar);
    });
    it("canActivate should return true if checkAuth returns response", (done) => {
        account.fromCheck = () => { return Observable.of({ roles: [  ] }); };
        guard.canActivate().subscribe((actual) => {
            expect(actual).toBeTruthy();
            done();
        });
    });
    it("canActivate should return false if checkAuth returns exception", (done) => {
        account.fromCheck = () => { return Observable.throw({}); };
        snackbar.fromOpen = () => {};
        guard.canActivate().subscribe((actual) => {
            expect(!actual).toBeTruthy();
            done();
        });
    });
    it("canActivate should open snackbar with message 'Вы не авторизованы', action 'Ok' and duration 5000 if checkAuth throws error", (done) => {
        account.fromCheck = () => { return Observable.throw({}); };
        snackbar.fromOpen = (message, action, options) => {
            expect(message).toBe("Вы не авторизованы");
            expect(action).toBe("Ok");
            expect(options.duration).toBe(5000);
            done();
        };
        guard.canActivate().subscribe();
    });
});

describe("TeacherGuard tsts", () => {
    let guard: TeacherGuard;
    let account: AccountServiceMock;
    let snackbar: SnackbarMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MdSnackBar, useClass: SnackbarMock },
                { provide: AccountService, useClass: AccountServiceMock },
                TeacherGuard
            ]
        });
        let bed = getTestBed();
        guard = bed.get(TeacherGuard);
        account = bed.get(AccountService);
        snackbar = bed.get(MdSnackBar);
    });
    it("canActivate should return true if roles array has 'Teacher'", (done) => {
        account.fromCheck = () => { return Observable.of({ roles: [ "Teacher" ] }); };
        guard.canActivate().subscribe((actual) => {
            expect(actual).toBeTruthy();
            done();
        });
    });
    it("canActivate should return false if roles arra doesn't have 'Teacher'", (done) => {
        account.fromCheck = () => { return Observable.of({ roles: [  ] }); };
        guard.canActivate().subscribe((actual) => {
            expect(!actual).toBeTruthy();
            done();
        });
    });
    it("canActivate should open snackbar with message 'Вы не авторизованы', action 'Ok' and duration 5000 if checkAuth throws error", (done) => {
        account.fromCheck = () => { return Observable.throw({}); };
        snackbar.fromOpen = (message, action, options) => {
            expect(message).toBe("Вы не авторизованы");
            expect(action).toBe("Ok");
            expect(options.duration).toBe(5000);
            done();
        };
        guard.canActivate().subscribe();
    });
    it("canActivate should return false if checkAuth throws error", (done) => {
        account.fromCheck = () => { return Observable.throw({}); };
        snackbar.fromOpen = (message, action, options) => {};
        guard.canActivate().subscribe((actual) => {
            expect(!actual).toBeTruthy();
            done();
        });
    });
});