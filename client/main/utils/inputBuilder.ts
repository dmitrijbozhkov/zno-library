import { AbstractControl, FormBuilder } from "@angular/forms";

/**
 * List of error messages
 */
export interface IErrorMessages {
    [error: string]: string;
}

/**
 * Constructs input that tracks errors
 */
export class ErrorInput {
    public element: AbstractControl;
    public messageList: IErrorMessages;
    public isErr: boolean;
    public errorMessage: string;
    constructor(builder: FormBuilder, init: string, validators: any[], errorMessages?: IErrorMessages) {
        this.messageList = errorMessages ? errorMessages : {};
        this.errorMessage = "";
        this.element = builder.control({ value: init, disabled: false }, validators);
        this.element.valueChanges.subscribe({
            next: (state) => {
                this.refreshErr();
            }
        });
        this.refreshErr();
    }
    /**
     * Refreshes fields error state
     */
    public refreshErr() {
        if (this.element.invalid) {
            let key = Object.keys(this.element.errors)[0];
            this.errorMessage = this.messageList[key] ? this.messageList[key] : key;
        }
        this.isErr = this.element.invalid;
    }
}