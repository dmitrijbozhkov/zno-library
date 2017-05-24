import { Component, OnInit } from "@angular/core";
import { AccountService } from "../services/account.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ErrorInput } from "../inputBuilder";

let infoErrorMessages = {
    required: "Поле обязательно для заполнения",
    maxLength: "Не более 40 сиволов"
};

let accErrorMessages = {
    email: "Неправильный email",
    minlength: "Пароль должен быть не менее 6 символов",
    required: "Поле обязательно для заполнения"
};

@Component({
    selector: "create-user",
    template: `
    <form class="login-form" [formGroup]="create" (ngSubmit)="submitForm($event, create.value)">
        <md-list class="content-window">
            <md-list-item class="login-item"><h1>Создать аккаунт</h1></md-list-item>
            <md-list-item class="login-input login-item">
                <md-input-container>
                    <input mdInput required placeholder="Имя" type="text" formControlName="name" />
                    <md-error *ngIf="nameInput.isErr">{{ nameInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
            <md-list-item class="login-input login-item">
                <md-input-container>
                    <input mdInput required placeholder="Фамилия" type="text" formControlName="surname" />
                    <md-error *ngIf="surnameInput.isErr">{{ surnameInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
            <md-list-item class="login-input login-item">
                <md-input-container>
                    <input mdInput required placeholder="Отчество" type="text" formControlName="lastName" />
                    <md-error *ngIf="lastNameInput.isErr">{{ lastNameInput.errorMessage }}</md-error>
                </md-input-container>
            </md-list-item>
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
    public create: FormGroup;
    public nameInput: ErrorInput;
    public surnameInput: ErrorInput;
    public lastNameInput: ErrorInput;
    public emailInput: ErrorInput;
    public passwordInput: ErrorInput;
    constructor(private fb: FormBuilder, private account: AccountService) {}
    public ngOnInit() {
        this.initForm();
    }
    public initForm() {
        this.nameInput = new ErrorInput(this.fb, "", [ Validators.required, Validators.maxLength(40) ], infoErrorMessages);
        this.surnameInput = new ErrorInput(this.fb, "", [ Validators.required, Validators.maxLength(40) ], infoErrorMessages);
        this.lastNameInput = new ErrorInput(this.fb, "", [ Validators.required, Validators.maxLength(40) ], infoErrorMessages);
        this.emailInput = new ErrorInput(this.fb, "", [ Validators.required, Validators.email ], accErrorMessages);
        this.passwordInput = new ErrorInput(this.fb, "", [ Validators.required, Validators.minLength(6) ], accErrorMessages);
        this.create = this.fb.group({
            name: this.nameInput.element,
            surname: this.surnameInput.element,
            lastName: this.lastNameInput.element,
            email: this.emailInput.element,
            password: this.passwordInput.element
        });
    }

    /**
     * Called on form submit
     * @param event Submit event
     * @param value Submit value
     */
    public submitForm(event: Event, value: any) {
        event.preventDefault();
        console.log(value);
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