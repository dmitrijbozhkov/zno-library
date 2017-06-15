import { Component, OnInit } from "@angular/core";
import { AccountService, TokenState } from "../../account/services/account.service";
import { Observable } from "rxjs";

export enum UserPrivilege {
    "Anon",
    "Student",
    "Teacher",
    "Admin"
}

@Component({
    selector: "panel-nav",
    template: `
    <nav *ngIf="accountState > 0" md-tab-nav-bar>
        <a md-tab-link routerLink="history">История</a>
        <a md-tab-link *ngIf="accountState > 1" routerLink="teacher">Панель учителя</a>
        <a md-tab-link *ngIf="accountState > 2" routerLink="admin">Панель администратора</a>
    </nav>
    <router-outlet></router-outlet>
    `
})
export class PanelNavComponent implements OnInit {
    public accountState: UserPrivilege;
    constructor(private account: AccountService) {}

    /**
     * Subscribes to account state
     */
    public ngOnInit() {
        this.account.state.subscribe((state) => {
            if (state === TokenState["authorized"]) {
                this.pushState();
            }
        });
    }

    /**
     * Pushes biggest user role
     */
    private pushState() {
        this.account.checkAuth()
        .map((account) => {
            if (account.roles.indexOf("Admin") !== -1) {
                return UserPrivilege["Admin"];
            } else if (account.roles.indexOf("Teacher") !== -1) {
                return UserPrivilege["Teacher"];
            } else {
                return UserPrivilege["Student"];
            }
        })
        .catch((err) => {
            return Observable.of(UserPrivilege["Anon"]);
        })
        .subscribe((privilege) => {
            this.accountState = privilege;
        });
    }
}