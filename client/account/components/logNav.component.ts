import { Component, OnInit } from "@angular/core";
import { AccountService, TokenState } from "../services/account.service";

@Component({
    selector: "logNav",
    template: `
    <button md-raised-button routerLink="{{loginState === 2 ? '/user' : '/user/create' }}" class="account"><i class="material-icons">account_box</i> Аккаунт</button>
    <button *ngIf="loginState === 2"  md-raised-button (click)="logout">Выйти</button>
    <button *ngIf="loginState === 1"  md-raised-button routerLink="/user/login">Войти</button>`
})
export class LogNavComponent implements OnInit {
    public loginState: number;
    constructor(private account: AccountService) {}
    public ngOnInit() {
        this.account.state.subscribe({
            next: (state) => {
                this.loginState = state;
            }
        });
    }
    public logout() {
        console.log("logout");
        this.account.logOff();
    }
}