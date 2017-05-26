/// <reference path="../../../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../../../node_modules/@types/mocha/index.d.ts" />

import * as assert from "assert";
import { Utils, ErrorInput } from "../../../main/utils/utils";
import { FormBuilder } from "@angular/forms";

describe("Utils tests", () => {
    let utils: Utils;
    beforeEach(() => {
        utils = new Utils();
    });
    it("handleResponse should take promise and turn it into observable", (done) => {
        let expected = "stuff";
        let promise = Promise.resolve(expected);
        utils.handleResponse(promise).subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("handleResponse should catch rejected Promise", (done) => {
        let expected = "stuff";
        let promise = Promise.reject(expected);
        utils.handleResponse(promise).subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("inputFactory should return constructor that creates ErrorInput", () => {
        let input = utils.inputFactory(new FormBuilder())("", []);
        assert.ok(input instanceof ErrorInput);
    });
});