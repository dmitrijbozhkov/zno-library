/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />
// Shims
import "zone.js/dist/zone";
import "reflect-metadata";
// Angular modules
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
// Initial components
import { MainComponent } from "./main.component";
import { NotFound } from "./notFound.component";
import { HomeComponent } from "./home.component";
// Application modules
import { AccountModule, LogNavComponent, AccountService, TeacherGuard, LoginGuard, AdminGuard } from "../account/account.module";
import { AppHttpModule } from "../http/http.module";
import { AccountDatabaseService, DatabaseService } from "../database/database.module";
import { UIModule } from "./UI.module";
import { LoadingService } from "./load/loading.service";
import { LoadingComponnt } from "./load/loading.component";
// Utils
import { utilsProvider } from "./utils/utils";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "**", component: NotFound }
];

/**
 * Provides window object
 */
export const windowProvider = { provide: Window, useValue: window };

@NgModule({
  imports: [
    UIModule,
    AccountModule,
    HttpModule,
    AppHttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [ HttpModule ],
  providers: [ AccountService, LoginGuard, AdminGuard, TeacherGuard, windowProvider, utilsProvider, LoadingService, AccountDatabaseService, DatabaseService ],
  declarations: [ MainComponent, NotFound, HomeComponent, LogNavComponent, LoadingComponnt ],
  bootstrap: [ MainComponent ]
})
export class InitModule { }

// Startup
platformBrowserDynamic().bootstrapModule(InitModule);