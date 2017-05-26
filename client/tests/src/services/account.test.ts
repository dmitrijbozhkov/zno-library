/// <reference path="../../../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../../../node_modules/@types/mocha/index.d.ts" />

import * as assert from "assert";
import { AccountService } from "../../../account/services/account.service";
import { Observable } from "rxjs";

function databaseServiceStub(fromGet, fromAdd) {
    function db() {}
    db.prototype.addDatabase = function(...args) { return fromAdd(args); };
    db.prototype.getDatabase = function(...args) { return fromGet(args); };
    return new db();
}

let win = {
    PouchDB: "stuff"
};

function createClientStub(responses: any) {
    function db(name: string) {
        this.name = name;
    };
    db.prototype.getRecord = function() { return responses.fromGet(); };
    return db;
}

let loading = {
    onStart: () => {},
    onEnd: () => {}
};

describe("AccountService tests", () => {
    it("initAccount should create user database", (done) => {
        let db = createClientStub({ fromGet: () => Observable.never() });
        let getCallback = (args) => { return new db("user"); };
        let addCallback = (args) => { assert.deepEqual(args[0], "user"); done(); };
        let service = new AccountService(databaseServiceStub(getCallback, addCallback) as any, {} as any, win as any, loading as any);
    });
    it("initAccount should push pending in state before everything", (done) => {
        let expected = 0;
        let db = createClientStub({ fromGet: () => Observable.of(expected) });
        let getCallback = (args) => { return new db("user"); };
        let addCallback = (args) => { };
        let service = new AccountService(databaseServiceStub(getCallback, addCallback) as any, {} as any, win as any, loading as any);
        service.state.subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("checkAuth should take token record from user database", (done) => {
        let expected = { token: "kek" };
        let db = createClientStub({ fromGet: () => Observable.of(expected) });
        let getCallback = (args) => { return new db("user"); };
        let addCallback = (args) => { };
        let service = new AccountService(databaseServiceStub(getCallback, addCallback) as any, {} as any, win as any, loading as any);
        service.checkAuth().subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
});