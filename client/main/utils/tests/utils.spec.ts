/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />

import { Utils, ErrorInput } from "../../../main/utils/utils";
import { FormBuilder, AbstractControl } from "@angular/forms";

describe("Utils tests", () => {
    let utils: Utils;
    beforeEach(() => {
        utils = new Utils();
    });
    it("handleResponse should take promise and turn it into observable", (done) => {
        let expected = "stuff";
        let promise = Promise.resolve(expected);
        utils.handleResponse(promise).subscribe((actual) => {
            expect(actual).toBe(expected);
            done();
        });
    });
    it("inputFactory should return constructor that creates ErrorInput", () => {
        let input = utils.inputFactory(new FormBuilder())("", []);
        expect(input instanceof ErrorInput).toBeTruthy();
    });
    it("translateErrorResponse should take errorResponse with error 'Password is incorrect' and return 'Неправельный формат пароля'", () => {
        let error = { error: "Password is incorrect" };
        let expected = "Неправельный формат пароля";
        let actual = utils.translateErrorResponse(error);
        expect(actual).toEqual(expected);
    });
    it("translateErrorResponse should take errorResponse with error 'No email field' and return 'Нет поля емейл'", () => {
        let error = { error: "No email field" };
        let expected = "Нет поля емейл";
        let actual = utils.translateErrorResponse(error);
        expect(actual).toEqual(expected);
    });
    it("Validators.sameFields should take AbstractControl and return null if values are equal", () => {
        let eqTo = { value: 1 };
        let control = { value: 1 };
        let actual = utils.Validators.sameFields(eqTo as any)(control as any);
        expect(actual).toBeNull();
    });
    it("Validators.sameFields should take AbstractControl and return error object if values are not equal", () => {
        let eqTo = { value: 1 };
        let control = { value: 2 };
        let actual = utils.Validators.sameFields(eqTo as any)(control as any);
        expect(actual).toEqual({ sameFields: { control: control.value, sameTo: eqTo.value } });
    });
    it("inputFactory should return ErrorInput where refreshErr should check if element is invalid and pass first error to errorMessage", () => {
        let expected = "message";
        let input = utils.inputFactory(new FormBuilder())("", [ () => { return { message: "val" }; } ]);
        input.element.patchValue(5);
        expect(input.errorMessage).toBe(expected);
    });
    it("inputFactory should return ErrorInput where refreshErr should check if element is invalid and set isErr to true", () => {
        let input = utils.inputFactory(new FormBuilder())("", [ () => { return { message: "val" }; } ]);
        input.element.patchValue(5);
        expect(input.isErr).toBeTruthy();
    });
});