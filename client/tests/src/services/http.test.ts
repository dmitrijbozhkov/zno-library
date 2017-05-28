/// <reference path="../../../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../../../node_modules/@types/mocha/index.d.ts" />

import * as assert from "assert";
import { AccountHttpService } from "../../../http/http.module";
import { Utils } from "../../../main/utils/utils";
import { Observable } from "rxjs";

function httpMock(returns: any) {
    function http() {}
    http.prototype.post = function(path: string, body: any, options?: any) {
        return returns.fromPost(path, body, options);
    };
    return http;
}

describe("AccountHttpService tests", () => {
    it("loginUser should take observable with login credentials and return observable with response", (done) => {
        let expected = "request";
        let post = () => { return Observable.of(expected); };
        let http = httpMock({ fromPost: post });
        let service = new AccountHttpService(new http() as any, new Utils());
        service.loginUser(Observable.of({ email: "kek@mail.ru", password: "pass1234", remember: true }))
        .subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("loginUser should take observable with login credentials and make post request to 'auth/login/' path", (done) => {
        let expected = "auth/login/";
        let post = (actual) => {  assert.deepEqual(actual, expected); return Observable.of(expected); };
        let http = httpMock({ fromPost: post });
        let service = new AccountHttpService(new http() as any, new Utils());
        service.loginUser(Observable.of({ email: "kek@mail.ru", password: "pass1234", remember: true }))
        .subscribe((actual) => {
            done();
        });
    });
    it("loginUser should take observable with login credentials and put in request body object with email and password", (done) => {
        let expected = { email: "kek@mail.ru", password: "pass1234" };
        let post = (path, body) => { return Observable.of(body); };
        let http = httpMock({ fromPost: post });
        let service = new AccountHttpService(new http() as any, new Utils());
        service.loginUser(Observable.of(expected))
        .subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("loginUser should take observable with login credentials and set content-type header 'application/json'", (done) => {
        let expected = "application/json";
        let post = (path, body, actual) => { assert.deepEqual(actual.headers.get("Content-Type"), expected); return Observable.of(body); };
        let http = httpMock({ fromPost: post });
        let service = new AccountHttpService(new http() as any, new Utils());
        service.loginUser(Observable.of({ email: "kek@mail.ru", password: "pass1234" }))
        .subscribe((actual) => {
            done();
        });
    });
    it("createUser should take observable with create credentials and return observable with response", (done) => {
        let expected = { email: "kek@mail.ru", password: "pass1234", name: "Vitya"};
        let post = (path, credentials) => { return Observable.of(credentials); };
        let http = httpMock({ fromPost: post });
        let service = new AccountHttpService(new http() as any, new Utils());
        service.createUser(Observable.of(expected))
        .subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("createUser should take observable with login credentials and make post request to 'auth/create/' path", (done) => {
        let expected = "auth/create/";
        let post = (actual) => {  assert.deepEqual(actual, expected); return Observable.of(expected); };
        let http = httpMock({ fromPost: post });
        let service = new AccountHttpService(new http() as any, new Utils());
        service.createUser(Observable.of({ email: "kek@mail.ru", password: "pass1234" }))
        .subscribe((actual) => {
            done();
        });
    });
    it("createUser should take observable with login credentials and put in request body object with them", (done) => {
        let expected = { email: "kek@mail.ru", password: "pass1234" };
        let post = (path, body) => { return Observable.of(body); };
        let http = httpMock({ fromPost: post });
        let service = new AccountHttpService(new http() as any, new Utils());
        service.createUser(Observable.of(expected))
        .subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("createUser should take observable with login credentials and set content-type header 'application/json'", (done) => {
        let expected = "application/json";
        let post = (path, body, actual) => { assert.deepEqual(actual.headers.get("Content-Type"), expected); return Observable.of(body); };
        let http = httpMock({ fromPost: post });
        let service = new AccountHttpService(new http() as any, new Utils());
        service.createUser(Observable.of({ email: "kek@mail.ru", password: "pass1234" }))
        .subscribe((actual) => {
            done();
        });
    });
});