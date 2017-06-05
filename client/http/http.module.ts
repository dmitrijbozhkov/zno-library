import { NgModule } from "@angular/core";
// imports
import { AccountHttpService } from "./account-http.service";
import { HistoryHttpService } from "./history-http.service";
import { CourseHttpService } from "./course-http.service";
import { TagHttpService } from "./tag-http.service";
// exports
export { AccountHttpService } from "./account-http.service";
export { HistoryHttpService } from "./history-http.service";
export { CourseHttpService } from "./course-http.service";
export { TagHttpService } from "./tag-http.service";

@NgModule({
    providers: [ AccountHttpService, HistoryHttpService, CourseHttpService, TagHttpService ]
})
export class AppHttpModule {}