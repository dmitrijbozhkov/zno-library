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
    }
    public ngOnInit() {
        this.initForm();
    }
    public initForm() {
        this.emailInput = this.inputFactory("", [ Validators.required, Validators.email ], errorMessages);
        this.passwordInput = this.inputFactory( "", [ Validators.required, Validators.minLength(6) ], errorMessages);
        this.login = this.fb.group({
            email: this.emailInput.element,
            password: this.passwordInput.element,
            remember: [ false ]
        });
    }
    public submitForm(event: Event, value: ILoginCredentials) {
        event.preventDefault();
        if (this.login.valid) {
            this.snackbar.open("logged in", "Cancel");
            this.account.logIn(value).subscribe((val) => {
                console.log(val);
                this.router.navigate([""]);
            });
        }
    }
    public resetForm(event: Event) {
        this.login.reset();
        event.preventDefault();
    }
}