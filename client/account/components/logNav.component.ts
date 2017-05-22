import { Component, OnInit } from "@angular/core";
import { AccountService } from "../services/account.service";

@Component({
    selector: "logNav",
    template: `
    <button md-raised-button routerLink="{{loginState ? '/user' : '/user/create' }}" class="account"><i class="material-icons">account_box</i> Аккаунт</button>
    <button *ngIf="loginState"  md-raised-button (click)="logout">Выйти</button>
    <button *ngIf="!loginState"  md-raised-button routerLink="/user/login">Войти</button>`
})
export class LogNavComponent implements OnInit {
    public loginState: boolean;
    constructor(private account: AccountService) {}
    public ngOnInit() {
        this.account.state.subscribe({
            next: (state) => {
                console.log(state);
                this.loginState = true;
            }
        });
    }
    public logout() {
        console.log("logout");
    }
}