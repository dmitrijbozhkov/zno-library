import { Component, OnInit, Output } from "@angular/core";
import { AccountService } from "../services/account.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Utils } from "../../main/utils/utils";
import { Response } from "@angular/http";
import { Router } from "@angular/router";
import { MdSnackBar } from "@angular/material";
import { IErrorMessages } from "../../main/inputs/reactive-input.component";

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
                <reactive-input [group]="create" [errorList]="infoErrorMessages" [controlName]="'name'" [type]="'text'" [placeholder]="'Имя'" required="true">
                </reactive-input>
            </md-list-item>
            <md-list-item class="form-input form-item">
                <reactive-input [group]="create" [errorList]="infoErrorMessages" [controlName]="'surname'" [type]="'text'" [placeholder]="'Фамилия'" required="true">
                </reactive-input>
            </md-list-item>
            <md-list-item class="form-input form-item">
                <reactive-input [group]="create" [errorList]="infoErrorMessages" [controlName]="'lastName'" [type]="'text'" [placeholder]="'Отчество'" required="true">
                </reactive-input>
            </md-list-item>
            <md-list-item class="form-input form-item">
                <reactive-input [group]="create" [errorList]="accErrorMessages" [controlName]="'email'" [type]="'email'" [placeholder]="'Email'" required="true">
                </reactive-input>
            </md-list-item>
            <md-list-item class="form-input form-item">
                <reactive-input [group]="create" [errorList]="accErrorMessages" [controlName]="'password'" [type]="'password'" [placeholder]="'Пароль'" required="true">
                </reactive-input>
            </md-list-item>
            <md-list-item class="form-input form-item">
                <reactive-input [group]="create" [errorList]="accErrorMessages" [controlName]="'repeatPassword'" [type]="'password'" [placeholder]="'Повторите пароль'" required="true">
                </reactive-input>
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
    private snackbar: MdSnackBar;
    private router: Router;
    private utils: Utils;
    // inputs
    @Output() public create: FormGroup;
    @Output() public infoErrorMessages: IErrorMessages;
    @Output() public accErrorMessages: IErrorMessages;
    constructor(fb: FormBuilder, account: AccountService, utils: Utils, snackbar: MdSnackBar, router: Router) {
        this.fb = fb;
        this.account = account;
        this.snackbar = snackbar;
        this.router = router;
        this.utils = utils;
        this.infoErrorMessages = infoErrorMessages;
        this.accErrorMessages = accErrorMessages;
    }
    public ngOnInit() {
        this.initForm();
    }

    /**
     * Initializes form
     */
    public initForm() {
        let passwordInput = this.fb.control("", [ Validators.required, Validators.minLength(6) ]);
        this.create = this.fb.group({
            name: this.fb.control("", [ Validators.required, Validators.maxLength(40) ]),
            surname: this.fb.control("", [ Validators.required, Validators.maxLength(40) ]),
            lastName: this.fb.control("", [ Validators.required, Validators.maxLength(40) ]),
            email: this.fb.control("", [ Validators.required, Validators.email ]),
            password: passwordInput,
            repeatPassword: this.fb.control("", [ Validators.required, Validators.minLength(6), this.utils.Validators.sameFields(passwordInput) ])
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