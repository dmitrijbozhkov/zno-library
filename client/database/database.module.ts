import { NgModule } from "@angular/core";
import { DatabaseService } from "./database.service";
export { DatabaseService, DatabaseClient } from "./database.service";
export { IUserDoc } from "./interfaces";

@NgModule({
    providers: [ DatabaseService ]
})
export class DatabaseModule {}