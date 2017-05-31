import { NgModule } from "@angular/core";
// imports
import { AccountHttpService } from "./account-http.service";
import { HistoryHttpService } from "./history-http.service";
import { AddCourseHttpService } from "./add-course-http.service";
// exports
export { AccountHttpService } from "./account-http.service";
export { HistoryHttpService } from "./history-http.service";
export { AddCourseHttpService } from "./add-course-http.service";

@NgModule({
    providers: [ AccountHttpService, HistoryHttpService, AddCourseHttpService ]
})
export class AppHttpModule {}