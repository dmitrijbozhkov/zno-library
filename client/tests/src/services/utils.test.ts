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
    it("inputFactory should return constructor that creates ErrorInput", () => {
        let input = utils.inputFactory(new FormBuilder())("", []);
        assert.ok(input instanceof ErrorInput);
    });
    it("translateErrorResponse should take errorResponse with error 'Password is incorrect' and return 'Неправельный формат пароля'", () => {
        let error = { error: "Password is incorrect" };
        let expected = "Неправельный формат пароля";
        let actual = utils.translateErrorResponse(error);
        assert.deepEqual(actual, expected);
    });
    it("translateErrorResponse should take errorResponse with error 'No email field' and return 'Нет поля емейл'", () => {
        let error = { error: "No email field" };
        let expected = "Нет поля емейл";
        let actual = utils.translateErrorResponse(error);
        assert.deepEqual(actual, expected);
    });
});