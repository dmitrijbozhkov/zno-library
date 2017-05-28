// Angular imports
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
// App imports
import { LoginGuard, TeacherGuard, AdminGuard } from "../account/account.module";
import { UIModule } from "../main/UI.module";
import { HistoryComponent } from "./components/history.component";
import { SettingsComponent } from "./components/settings.component";
import { PanelNavComponent } from "./components/panel-nav.component";
import { TeacherPanelComponent } from "./components/teacher-panel.component";
import { AdminPanelComponent } from "./components/admin-panel.component";
import { HistoryService } from "./services/history.service";
import { AddCourseComponent } from "./components/course/add-course.component";
import { RemoveCourseComponent } from "./components/course/remove-course.component";

let panelRoutes: Routes = [
    { path: "user", component: PanelNavComponent, canActivate: [ LoginGuard ], children: [
        { path: "", redirectTo: "history", pathMatch: "prefix" },
        { path: "history", component: HistoryComponent },
        { path: "settings", component: SettingsComponent },
        { path: "teacher", component: TeacherPanelComponent, canActivate: [ TeacherGuard ] },
        { path: "course/add", component: AddCourseComponent, canActivate: [ TeacherGuard ] },
        { path: "course/remove", component: RemoveCourseComponent, canActivate: [ TeacherGuard ] },
        { path: "admin", component: AdminPanelComponent, canActivate: [ AdminGuard ] },
    ] }
];

@NgModule({
    imports: [ ReactiveFormsModule, UIModule, FormsModule, RouterModule.forRoot(panelRoutes) ],
    declarations: [
        HistoryComponent,
        SettingsComponent,
        PanelNavComponent,
        TeacherPanelComponent,
        AdminPanelComponent,
        AddCourseComponent,
        RemoveCourseComponent
    ],
    providers: [ HistoryService ]
})
export class PanelModule {}