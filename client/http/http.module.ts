import { NgModule } from "@angular/core";
import { AccountHttpService } from "./account-http.service";
export { AccountHttpService } from "./account-http.service";

@NgModule({
    providers: [ AccountHttpService ]
})
export class AppHttpModule {}