/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />

// declare var it = (name: string, inject: (tokens: any[], fn: Function) => any, test: (api: any) => void)

import { inject, TestBed } from "@angular/core/testing";
import { AccountHttpService } from "../account-http.service";
import { Http, BaseRequestOptions, XHRBackend } from "@angular/http";
import { Utils } from "../../main/utils/utils";
import { MockBackend } from "@angular/http/testing";

describe("Tests for AccountHttpService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [
            Utils,
            BaseRequestOptions,
            MockBackend,
            {
                provide: Http,
                deps: [ MockBackend, BaseRequestOptions ],
                useFactory: function(backend, defaultOptions) {
                    return new Http(backend, defaultOptions);
                }
            }]
        });
        TestBed.compileComponents();
    });
    it("loginUser should call", inject([ AccountHttpService ], (api) => {
        expect(true).toBe(true);
    }));
});