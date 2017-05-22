import { NgModule } from "@angular/core";
import { AccountDatabaseService } from "./account-database.service";
export { AccountDatabaseService } from "./account-database.service";

/**
 * Interface of database errors
 */
export interface IDatabaseError {
    error: boolean;
    message: string;
    name: string;
    reason: string;
    status: number;
}

/**
 * Interface of database responses
 */
export interface IdatabaseResponse {
    _id: string;
    _rev: string;
    [data: string]: string;
}

@NgModule({
    providers: [ AccountDatabaseService ]
})
export class DatabaseModule {}