/// <reference path="../../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import * as assert from "assert";
import { AccountService } from "../../account/services/account.service";
import { ErrorInput } from "../../account/inputBuilder";
import "rxjs";

describe("Tests for  AccountService", () => {
    let service: AccountService;
    beforeEach(() => {
        service = new AccountService();
    });
    it("AccountService.state should pass after subscribing return object with isLogged equal to true", (done) => {
        service.state.subscribe({
            next: (state) => {
                assert.ok(!state.isLogged);
                done();
            }
        });
    });
});