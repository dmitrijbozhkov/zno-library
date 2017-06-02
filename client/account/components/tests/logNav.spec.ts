/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />

import { TestBed, async, getTestBed } from "@angular/core/testing";
import { LogNavComponent } from "../logNav.component";
import { AccountService } from "../../services/account.service";
import { MdSnackBar } from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { ReplaySubject, Observable } from "rxjs";

class AccountServiceStub {
    constructor(logoffCallback: Function) {
        this.state = new ReplaySubject();
        this.state.next(1);
        this.logOff = () => logoffCallback();
    }
    public state: ReplaySubject<number>;
    public logOff: () => void;
    initAccount() {}
}

describe("logNav component tests", () => {
    it("logNav should subscribe to AccountService state and change loginState", () => {
        let component = new LogNavComponent(new AccountServiceStub(() => {}) as any, {} as any, {} as any);
        component.ngOnInit();
        expect(component.loginState).toBe(1);
    });
    it("logNav should show login button if account state is not authorized", (done) => {
        let logoff = () => { expect(true).toBeTruthy(); done(); return Observable.never(); };
        let component = new LogNavComponent(new AccountServiceStub(logoff) as any, {} as any, {} as any);
        component.logout();
    });
});