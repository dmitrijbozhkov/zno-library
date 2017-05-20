import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { NotFound } from "./notFound.component";
import { HomeComponent } from "./home.component";
import { LoginComponent } from "../account/components/login.component";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "user/login", component: LoginComponent },
  { path: "**", component: NotFound }
];

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes) ],
    exports: [ RouterModule ]
})
export class Router {}