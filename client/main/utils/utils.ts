// Input
import { FormBuilder } from "@angular/forms";
import { ErrorInput, IErrorMessages } from "./inputBuilder";
import { Observable } from "rxjs";
import { Headers } from "@angular/http";
// Exports
export { ErrorInput, IErrorMessages } from "./inputBuilder";

/**
 * Factory that creates ErrorInput
 */
export type buildInput = (init: string, validators: any[], errorMessages?: IErrorMessages) => ErrorInput;

/**
 * Class with utils
 */
export class Utils {
    /**
     * Factory for creationg input
     * @param builder Form builder for input creation
     */
    public inputFactory(builder: FormBuilder): buildInput {
        return (init: string, validators: any[], errorMessages?: IErrorMessages) => {
            return new ErrorInput(builder, init, validators, errorMessages);
        };
    }

    /**
     * Handles resource promise responses and errors
     * @param response Promise with response
     */
    public handleResponse<T>(response:  Promise<T>): Observable<T> {
        return this.handleError(Observable.fromPromise(response));
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