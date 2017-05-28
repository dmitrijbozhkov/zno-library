import { Injectable, Inject } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AccountService } from "./account.service";
import { Observable } from "rxjs";
import { MdSnackBar } from "@angular/material";

/**
 * Checks if user is a teacher
 */
@Injectable()
export class TeacherGuard implements CanActivate {
    private account: AccountService;
    private snackbar: MdSnackBar;
    constructor(@Inject(AccountService) account: AccountService, @Inject(MdSnackBar) snackbar: MdSnackBar) {
        this.account = account;
        this.snackbar = snackbar;
    }

    /**
     * Checks if route can be activated
     */
    canActivate() {
        return this.account.checkAuth()
            .map((response) => { return response.roles.indexOf("Teacher") !== -1; })
            .catch((response) => {
                this.snackbar.dismiss();
                this.snackbar.open("Вы не авторизованы", "Ok", { duration: 5000 });
                return Observable.of(false);
            });
    }
}