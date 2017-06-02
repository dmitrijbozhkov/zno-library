import { Component, OnInit } from "@angular/core";
import { AccountService, TokenState } from "../services/account.service";
import { MdSnackBar } from "@angular/material";
import { Router } from "@angular/router";

@Component({
    selector: "logNav",
    template: `
    <button md-raised-button routerLink="{{loginState === 2 ? '/user' : '/user/create' }}" class="account"><i class="material-icons">account_box</i> Аккаунт</button>
    <button *ngIf="loginState === 2"  md-raised-button (click)="logout()">Выйти</button>
    <button *ngIf="loginState === 1"  md-raised-button routerLink="/user/login">Войти</button>`
})
export class LogNavComponent implements OnInit {
    public loginState: number;
    constructor(private account: AccountService, private snackbar: MdSnackBar, private router: Router) {}

    /**
     * Listens for changes in authorization state
     */
    public ngOnInit() {
        this.account.initAccount();
        this.account.state.subscribe({
            next: (state) => {
                this.loginState = state;
            }
        });
    }

    /**
     * Handles logout
     */
    public logout() {
        this.account.logOff().subscribe(() => {
            this.snackbar.dismiss();
            this.snackbar.open("Вы вышли из аккаунта", "Ok", { duration: 5000 });
            this.router.navigate([ "" ]);
        });
    }
}