import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ErrorInput } from "../inputBuilder";

let errorMessages = {
    required: "Поле обязательно для заполнения",
    email: "Неправильный email",
    minlength: "Пароль должен быть не менее 6 символов"
};

@Component({
    selector: "login",
    template: `
    <form class="login-form" [formGroup]="login" (ngSubmit)="submitForm($event, login.value)">
        <md-list class="content-window">
            <md-list-item class="login-item"><h1>Вход в аккаунт</h1></md-list-item>
            <md-list-item class="login-input login-item">
                <md-input-container>
                    <input mdInput required placeholder="Email" type="email" formControlName="email" />
                    <md-error *ngIf="emailInput.isErr">{{ emailInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
            <md-list-item class="login-input login-item">
                <md-input-container>
                    <input mdInput required placeholder="Пароль" type="password" formControlName="password" />
                    <md-error *ngIf="passwordInput.isErr">{{ passwordInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
            <md-list-item class="login-item">
                <md-checkbox formControlName="remember">Запомнить меня</md-checkbox>
            </md-list-item>
            <md-list-item class="login-item">
                <div class="button-wrapper">
                    <button md-raised-button class="clean-login" type="reset" (click)="resetForm($event)">Очистить</button>
                    <button md-raised-button class="send-login" type="submit">Отправить</button>
                </div>
            </md-list-item>
        </md-list>
    </form>`
})
export class LoginComponent implements OnInit {
    public login: FormGroup;
    public emailInput: ErrorInput;
    public passwordInput: ErrorInput;
    constructor(private fb: FormBuilder) {}
    public ngOnInit() {
        this.initForm();
    }
    public initForm() {
        this.emailInput = new ErrorInput(this.fb, "", [ Validators.required, Validators.email ], errorMessages);
        this.passwordInput = new ErrorInput(this.fb, "", [ Validators.required, Validators.minLength(6) ], errorMessages);
        this.login = this.fb.group({
            email: this.emailInput.element,
            password: this.passwordInput.element,
            remember: [ false ]
        });
    }
    public submitForm(event: Event, value: any) {
        event.preventDefault();
        console.log(this.login.valid);
    }
    public resetForm(event: Event) {
        this.login.reset();
        event.preventDefault();
    }
}