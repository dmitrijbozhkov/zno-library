import { Injectable, Inject } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AccountService } from "./account.service";
import { Observable } from "rxjs";
import { MdSnackBar } from "@angular/material";

/**
 * Checks if user is logged in
 */
@Injectable()
export class LoginGuard implements CanActivate {
    private account: AccountService;
    private snackbar: MdSnackBar;
    constructor(@Inject(AccountService) account: AccountService, @Inject(MdSnackBar) snackbar: MdSnackBar) {
        this.account = account;
        this.snackbar = snackbar;
    }

    /**
     * Checks if route can be activated
     */
    public canActivate() {
        return this.account.checkAuth()
            .map((token) => { return true; })
            .catch((error) => {
                this.snackbar.dismiss();
                this.snackbar.open("Вы не авторизованы", "Ok", { duration: 5000 });
                return Observable.of(false);
            });
    }
}