import { Component, OnInit } from "@angular/core";
import { AccountService, IAccountState } from "../services/account.service";

@Component({
    selector: "logNav",
    template: `
    <button md-raised-button routerLink="/user" class="account"><i class="material-icons">account_box</i> Account</button>
    <button *ngIf="loginState"  md-raised-button (click)="logout">Logout</button>
    <button *ngIf="!loginState"  md-raised-button routerLink="/user/login">Login</button>`,
    providers: [ AccountService ]
})
export class LogNavComponent implements OnInit {
    public loginState: boolean;
    constructor(public account: AccountService) {}
    public ngOnInit() {
        this.account.state.subscribe({
            next: (state: IAccountState) => {
                this.loginState = state.isLogged;
            }
        });
    }
    public logout() {
        console.log("logout");
    }
}