// Angular imports
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
// Application imports
export { LogNavComponent } from "./components/logNav.component";
import { LoginComponent } from "./components/login.component";
import { CreateUserComponent } from "./components/create.component";
export { AccountService } from "./services/account.service";
export { LoginComponent } from "./components/login.component";
export { CreateUserComponent } from "./components/create.component";
import { UIModule } from "../main/UI.module";

let userRoutes: Routes = [
    { path: "user/login", component: LoginComponent },
    { path: "user/create", component: CreateUserComponent }
];

@NgModule({
    imports: [ ReactiveFormsModule, UIModule, FormsModule, RouterModule.forRoot(userRoutes) ],
    declarations: [ LoginComponent, CreateUserComponent ]
})
export class AccountModule {}