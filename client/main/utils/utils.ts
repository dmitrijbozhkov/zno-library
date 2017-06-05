// Input
import { FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";
import { Headers } from "@angular/http";
import { BACKEND_ERROR_MAPPING, BACKEND_AUTH_FIELDS, DATABASE_ERRORS } from "./errorMapping";
import { Response } from "@angular/http";
import { sameFields } from "./sameValidator";

/**
 * Response with error
 */
export type errorResponse = { error: string };

/**
 * Class with utils
 */
export class Utils {

    /**
     * Collection of input validators
     */
    public Validators = {
        sameFields: sameFields
    };

    /**
     * Constructs error message for no field error
     * @param field Field name
     */
    private noFieldErr(field: string) {
        return `Нет поля ${BACKEND_AUTH_FIELDS[field]}`;
    }

    /**
     * Translates database error
     * @param response Error response object
     */
    public translateErrorResponse(response: errorResponse) {
        let errContent = response.error;
        let words = (errContent as string).split(" ").filter((word) => { return word !== ""; });
        let nofield1 = words.indexOf("No");
        let nofield2 = words.indexOf("field");
        if ( nofield1 === -1 && nofield2 === -1) {
            return BACKEND_ERROR_MAPPING[errContent];
        } else {
            return this.noFieldErr(words[nofield1 + 1]);
        }
    }

    /**
     * Translates database errors
     * @param error Error object
     */
    public translateDatabaseError(error: any) {
        return DATABASE_ERRORS[error.name];
    }

    /**
     * Handles resource promise responses and errors
     * @param response Promise with response
     */
    public handleResponse<T>(response:  Promise<T>): Observable<T> {
        return Observable.fromPromise(response);
    }

    /**
     * Handles resource observable responses and errors
     * @param response Observable with response
     */
    public handleError<T>(response:  Observable<T>): Observable<T> {
        return response.catch((err, caught) => { return Observable.of(err); });
    }

    /**
     * Returns content-type header for json request body
     */
    public JsonType() {
        return new Headers({ "Content-Type": "application/json" });
    }
}

/**
 * Provides handler for application resources
 */
export const utilsProvider = { provide: Utils, useClass: Utils };