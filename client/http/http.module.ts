import { NgModule } from "@angular/core";
import { AccountHttpService } from "./account-http.service";
import { HistoryHttpService } from "./history-http.service";
export { AccountHttpService } from "./account-http.service";
export { HistoryHttpService } from "./history-http.service";

@NgModule({
    providers: [ AccountHttpService, HistoryHttpService ]
})
export class AppHttpModule {}