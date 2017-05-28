// Angular imports
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
// Account exports
export { LogNavComponent } from "./components/logNav.component";
export { AccountService } from "./services/account.service";
export { LoginComponent } from "./components/login.component";
export { CreateUserComponent } from "./components/create.component";
export { AdminGuard } from "./services/adminGuard.service";
export { LoginGuard } from "./services/loginGuard.service";
export { TeacherGuard } from "./services/teacherGuard.service";
// Application imports
import { LoginComponent } from "./components/login.component";
import { CreateUserComponent } from "./components/create.component";
import { UIModule } from "../main/UI.module";

let userRoutes: Routes = [
    { path: "user/login", component: LoginComponent },
    { path: "user/create", component: CreateUserComponent },
];

@NgModule({
    imports: [ ReactiveFormsModule, UIModule, FormsModule, RouterModule.forRoot(userRoutes) ],
    declarations: [ LoginComponent, CreateUserComponent ],
})
export class AccountModule {}