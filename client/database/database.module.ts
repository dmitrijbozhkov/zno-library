import { NgModule } from "@angular/core";
import { DatabaseService } from "./database.service";
export { DatabaseService } from "./database.service";
export { DatabaseClient, BaseDatabaseClient } from "./databaseClient";
export { InMemoryStore } from "./inMemoryStore";
export { IUserDoc } from "./interfaces";

@NgModule({
    providers: [ DatabaseService ]
})
export class DatabaseModule {}