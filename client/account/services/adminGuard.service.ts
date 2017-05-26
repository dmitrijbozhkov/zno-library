import { Injectable, Inject } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AccountService } from "./account.service";

/**
 * Checks if user is logged in
 */
@Injectable()
export class AdminGuard implements CanActivate {
    private account: AccountService;
    constructor(@Inject(AccountService) account: AccountService ) {
        this.account = account;
    }

    /**
     * Checks if route can be activated
     * @param route
     * @param state
     */
    canActivate(route, state) {
        console.log(route, state);
        return true;
    }
}