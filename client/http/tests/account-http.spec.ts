/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />

import { TestBed, async, getTestBed } from "@angular/core/testing";
import { AccountHttpService } from "../account-http.service";
import { Http, BaseRequestOptions, XHRBackend, ResponseOptions, Response, Headers } from "@angular/http";
import { Utils } from "../../main/utils/utils";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Observable } from "rxjs";

describe("Tests for AccountHttpService", () => {
    let service: AccountHttpService;
    let backend: MockBackend;
    beforeEach(async(() => {
        TestBed.configureTestingModule({ providers: [
            AccountHttpService,
            Utils,
            BaseRequestOptions,
            MockBackend,
            {
                provide: Http,
                deps: [ MockBackend, BaseRequestOptions ],
                useFactory: function(backend: XHRBackend, defaultOptions: BaseRequestOptions) {
                    return new Http(backend, defaultOptions);
                }
            }]
        });
        let bed = getTestBed();
        service = bed.get(AccountHttpService);
        backend = bed.get(MockBackend);
    }));
    it("loginUser should take observable of ILoginCredentials and pass email and password into post request body", (done) => {
        let expected = { email: "lel@mail.ru", password: "1234pass" };
        backend.connections.subscribe((connection: MockConnection) => {
            let body = connection.request.getBody();
            let actual = JSON.parse(body);
            expect(actual).toEqual(expected);
            done();
        });
        service.loginUser(Observable.of(expected)).subscribe((response) => {});
    });
    it("loginUser should call 'auth/login/' url", (done) => {
        let expected = "auth/login/";
        backend.connections.subscribe((connection: MockConnection) => {
            let actual = connection.request.url;
            expect(actual).toBe(expected);
            done();
        });
        service.loginUser(Observable.of({ email: "lel@mail.ru", password: "1234pass" })).subscribe();
    });
    it("loginUser should have 'application/json' 'Content-Type' header", (done) => {
        let expected = "application/json";
        backend.connections.subscribe((connection: MockConnection) => {
            let actual = connection.request.headers.get("Content-Type");
            expect(actual).toBe(expected);
            done();
        });
        service.loginUser(Observable.of({ email: "lel@mail.ru", password: "1234pass" })).subscribe();
    });
    it("loinUser should return response observable from request", (done) => {
        let expected = { body: "token", status: 200 };
        backend.connections.subscribe((connection: MockConnection) => {
            let actual = connection.mockRespond(expected as any);
        });
        service.loginUser(Observable.of({ email: "lel@mail.ru", password: "1234pass" })).subscribe((actual) => {
            expect(actual).toEqual(expected as any);
            done();
        });
    });
    it("createUser should take observable of ICreate credentials and pass them into request body", (done) => {
        let expected = {
            email: "lel@mail.ru",
            password: "pass1234",
            name: "dima",
            surname: "kek",
            lastName: "pepe"
        };
        backend.connections.subscribe((connection: MockConnection) => {
            let body = connection.request.getBody();
            let actual = JSON.parse(body);
            expect(actual).toEqual(expected);
            done();
        });
        service.createUser(Observable.of(expected)).subscribe((response) => {});
    });
    it("createUser should call 'auth/create/'", (done) => {
        let expected = "auth/create/";
        backend.connections.subscribe((connection: MockConnection) => {
            let actual = connection.request.url;
            expect(actual).toBe(expected);
            done();
        });
        service.createUser(Observable.of({ })).subscribe();
    });
    it("createUser should have 'application/json' 'Content-Type' header", (done) => {
        let expected = "application/json";
        backend.connections.subscribe((connection: MockConnection) => {
            let actual = connection.request.headers.get("Content-Type");
            expect(actual).toBe(expected);
            done();
        });
        service.createUser(Observable.of({ })).subscribe();
    });
    it("createUser should return response observable from request", (done) => {
        let expected = { body: "token", status: 200 };
        backend.connections.subscribe((connection: MockConnection) => {
            let actual = connection.mockRespond(expected as any);
        });
        service.createUser(Observable.of({ email: "lel@mail.ru", password: "1234pass" })).subscribe((actual) => {
            expect(actual).toEqual(expected as any);
            done();
        });
    });
});