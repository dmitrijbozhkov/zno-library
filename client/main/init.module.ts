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
import { AccountModule, LogNavComponent, AccountService } from "../account/account.module";
import { AppHttpModule } from "../http/http.module";
import { DatabaseModule } from "../database/database.module";
import { UIModule } from "./UI.module";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "**", component: NotFound }
];

@NgModule({
  imports: [
    UIModule,
    AccountModule,
    HttpModule,
    AppHttpModule,
    DatabaseModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [ HttpModule ],
  providers: [ AccountService ],
  declarations: [ MainComponent, NotFound, HomeComponent, LogNavComponent ],
  bootstrap: [ MainComponent ]
})
export class InitModule { }

// Startup
platformBrowserDynamic().bootstrapModule(InitModule);