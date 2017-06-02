import { Component, OnInit } from "@angular/core";
import { AccountService } from "../services/account.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Utils, ErrorInput, IErrorMessages, buildInput } from "../../main/utils/utils";
import { Response } from "@angular/http";
import { Router } from "@angular/router";
import { MdSnackBar } from "@angular/material";

export let infoErrorMessages = {
    required: "Поле обязательно для заполнения",
    maxlength: "Не более 40 сиволов"
};

export let accErrorMessages = {
    email: "Неправильный email",
    minlength: "Пароль должен быть не менее 6 символов",
    required: "Поле обязательно для заполнения",
    sameFields: "Пароли должны совпадать"
};

@Component({
    selector: "create-user",
    template: `
    <form class="login-form" [formGroup]="create" (ngSubmit)="submitForm($event, create.value)">
        <md-list class="content-window">
            <md-list-item class="form-item"><h1>Создать аккаунт</h1></md-list-item>
            <md-list-item class="form-input form-item">
                <md-input-container>
                    <input mdInput required placeholder="Имя" type="text" formControlName="name" />
                    <md-error *ngIf="nameInput.isErr">{{ nameInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
            <md-list-item class="form-input form-item">
                <md-input-container>
                    <input mdInput required placeholder="Фамилия" type="text" formControlName="surname" />
                    <md-error *ngIf="surnameInput.isErr">{{ surnameInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
            <md-list-item class="form-input form-item">
                <md-input-container>
                    <input mdInput required placeholder="Отчество" type="text" formControlName="lastName" />
                    <md-error *ngIf="lastNameInput.isErr">{{ lastNameInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
            <md-list-item class="form-input form-item">
                <md-input-container>
                    <input mdInput required placeholder="Email" type="email" formControlName="email" />
                    <md-error *ngIf="emailInput.isErr">{{ emailInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
            <md-list-item class="form-input form-item">
                <md-input-container>
                    <input mdInput required placeholder="Пароль" type="password" formControlName="password" />
                    <md-error *ngIf="passwordInput.isErr">{{ passwordInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
            <md-list-item class="form-input form-item">
                <md-input-container>
                    <input mdInput required placeholder="Повторите пароль" type="password" formControlName="repeatPassword" />
                    <md-error *ngIf="repeatPasswordInput.isErr">{{ repeatPasswordInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
            <md-list-item class="form-item">
                <div class="link-wrapper">
                    <a routerLink="../login" routerLinkActive="active">Уже есть аккаунт?</a>
                </div>
                <div class="button-wrapper">
                    <button md-raised-button class="clean-login" type="reset" (click)="resetForm($event)">Очистить</button>
                    <button md-raised-button class="send-login" type="submit">Отправить</button>
                </div>
            </md-list-item>
        </md-list>
    </form>`
})
export class CreateUserComponent implements OnInit {
    // services
    private fb: FormBuilder;
    private account: AccountService;
    private inputFactory: buildInput;
    private snackbar: MdSnackBar;
    private router: Router;
    private utils: Utils;
    // inputs
    public create: FormGroup;
    public nameInput: ErrorInput;
    public surnameInput: ErrorInput;
    public lastNameInput: ErrorInput;
    public emailInput: ErrorInput;
    public passwordInput: ErrorInput;
    public repeatPasswordInput: ErrorInput;
    constructor(fb: FormBuilder, account: AccountService, utils: Utils, snackbar: MdSnackBar, router: Router) {
        this.fb = fb;
        this.account = account;
        this.inputFactory = utils.inputFactory(fb);
        this.snackbar = snackbar;
        this.router = router;
        this.utils = utils;
    }
    public ngOnInit() {
        this.initForm();
    }

    /**
     * Initializes form
     */
    public initForm() {
        this.nameInput = this.inputFactory("", [ Validators.required, Validators.maxLength(40) ], infoErrorMessages);
        this.surnameInput = this.inputFactory("", [ Validators.required, Validators.maxLength(40) ], infoErrorMessages);
        this.lastNameInput = this.inputFactory("", [ Validators.required, Validators.maxLength(40) ], infoErrorMessages);
        this.emailInput = this.inputFactory("", [ Validators.required, Validators.email ], accErrorMessages);
        this.passwordInput = this.inputFactory("", [ Validators.required, Validators.minLength(6) ], accErrorMessages);
        this.repeatPasswordInput = this.inputFactory("", [ Validators.required, Validators.minLength(6), this.utils.Validators.sameFields(this.passwordInput.element) ], accErrorMessages);
        this.create = this.fb.group({
            name: this.nameInput.element,
            surname: this.surnameInput.element,
            lastName: this.lastNameInput.element,
            email: this.emailInput.element,
            password: this.passwordInput.element,
            repeatPassword: this.repeatPasswordInput.element
        });
    }

    /**
     * Closes snackbar
     */
    private resetSnackbar() {
        this.snackbar.dismiss();
    }

    /**
     * Handles user creation
     * @param response Successful http response
     */
    private handleCreate(response: Response) {
        this.resetSnackbar();
        this.snackbar.open("Аккаунт создан", "Ok", { duration: 5000 });
        this.router.navigate(["user", "login"]);
    }

    /**
     * Handles user creation error
     * @param error Http error
     */
    private handleErr(error: Response) {
        let parsedError = error.json();
        this.resetSnackbar();
        this.snackbar.open(`Ошибка: ${this.utils.translateErrorResponse(parsedError)}`, "Ok", { duration: 5000 });
        this.create.reset();
    }

    /**
     * Called on form submit
     * @param event Submit event
     * @param value Submit value
     */
    public submitForm(event: Event, value: any) {
        event.preventDefault();
        if (this.create.valid) {
            this.account.create({ email: value.email, password: value.password, name: value.name, surname: value.surname, lastName: value.lastName }).subscribe((res) => {
                this.handleCreate(res);
            }, (err) => {
                this.handleErr(err);
            });
        }
    }

    /**
     * Called on form reset
     * @param event Reset event
     */
    public resetForm(event: Event) {
        this.create.reset();
        event.preventDefault();
    }
}