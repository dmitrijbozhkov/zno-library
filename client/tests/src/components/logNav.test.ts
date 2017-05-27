/// <reference path="../../../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../../../node_modules/@types/mocha/index.d.ts" />

import * as assert from "assert";
import { LogNavComponent } from "../../../account/components/logNav.component";
import { ReplaySubject } from "rxjs";

class AccountServiceStub {
    constructor(logoffCallback: Function) {
        this.state = new ReplaySubject();
        this.state.next(1);
        this.logOff = () => logoffCallback();
    }
    public state: ReplaySubject<number>;
    public logOff: () => void;
}

describe("logNav component tests", () => {
    beforeEach(() => {
    });
    it("logNav should subscribe to AccountService state and change loginState", () => {
        let component = new LogNavComponent(new AccountServiceStub(() => {}) as any, {} as any, {} as any);
        component.ngOnInit();
        assert.deepEqual(component.loginState, 1);
    });
    it("logNav should show login button if account state is not authorized", (done) => {
        let logoff = () => { assert.ok(true); done(); };
        let component = new LogNavComponent(new AccountServiceStub(logoff) as any, {} as any, {} as any);
        component.logout();
    });
});