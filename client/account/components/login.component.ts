import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { MdSnackBar } from "@angular/material";
import { Utils, ErrorInput, IErrorMessages, buildInput } from "../../main/utils/utils";
import { AccountService } from "../services/account.service";
import { ILoginCredentials } from "../services/account.service";
import { Router } from "@angular/router";

let errorMessages: IErrorMessages = {
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
    // services
    private inputFactory: buildInput;
    private fb: FormBuilder;
    private account: AccountService;
    private snackbar: MdSnackBar;
    private router: Router;
    private utils: Utils;
    // Inputs
    public login: FormGroup;
    public emailInput: ErrorInput;
    public passwordInput: ErrorInput;
    constructor(fb: FormBuilder, account: AccountService, utils: Utils, snackbar: MdSnackBar, router: Router) {
        this.inputFactory = utils.inputFactory(fb);
        this.fb = fb;
        this.account = account;
        this.snackbar = snackbar;
        this.router = router;
        this.utils = utils;
    }
    public ngOnInit() {
        this.initForm();
    }

    /**
     * Initializes login form
     */
    public initForm() {
        this.emailInput = this.inputFactory("", [ Validators.required, Validators.email ], errorMessages);
        this.passwordInput = this.inputFactory( "", [ Validators.required, Validators.minLength(6) ], errorMessages);
        this.login = this.fb.group({
            email: this.emailInput.element,
            password: this.passwordInput.element,
            remember: [ false ]
        });
    }

    /**
     * Closes snackbar
     */
    private resetSnackbar() {
        this.snackbar.dismiss();
    }

    /**
     * Handles successful login
     * @param response Login response
     */
    private handleLogin(response) {
        this.resetSnackbar();
        this.snackbar.open("Авторизация успешна", "Ок", { duration: 5000 });
        this.router.navigate([""]);
    }

    /**
     * Handles login error
     * @param err Error response
     */
    private handleError(error) {
        if (!error.error) {
            let parsedError = error.json();
            this.resetSnackbar();
            this.snackbar.open(`Ошибка: ${this.utils.translateErrorResponse(parsedError)}`, "Ok", { duration: 5000 });
        } else {
            throw new Error(error);
        }
        this.login.reset();
    }

    /**
     * Submits login form
     * @param event Submit event
     * @param value Inputs values
     */
    public submitForm(event: Event, value: ILoginCredentials) {
        event.preventDefault();
        if (this.login.valid) {
            this.account.logIn(value).subscribe((val) => {
                this.handleLogin(val);
            }, (err) => {
                this.handleError(err);
            });
        }
    }

    /**
     * Resets login form
     * @param event Reset event
     */
    public resetForm(event: Event) {
        this.login.reset();
        event.preventDefault();
    }
}