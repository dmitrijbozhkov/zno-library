import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { NotFound } from "./notFound.component";
import { HomeComponent } from "./home.component";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "**", component: NotFound }
];

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes) ],
    exports: [ RouterModule ]
})
export class Router {}