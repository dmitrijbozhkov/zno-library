/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />
// Shims
import "zone.js/dist/zone";
import "reflect-metadata";
// Angular modules
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
// Initial components
import { MainComponent } from "./main.component";
import { NotFound } from "./notFound.component";
import { HomeComponent } from "./home.component";
// Router
import { Router } from "./router.module";
// Material design
import { MdToolbarModule, MdButtonModule, MdSidenavModule, MdIconModule, MdInputModule, MdCheckboxModule, MdListModule, MaterialModule, MdSnackBarModule } from "@angular/material";
import { MdIconRegistry } from "@angular/material";
// Application modules
import { AccountModule, LogNavComponent, LoginComponent, AccountService } from "../account/account.module";

@NgModule({
  imports: [ BrowserModule, BrowserAnimationsModule, Router, MdToolbarModule, MdButtonModule, MdSidenavModule, AccountModule, MdInputModule, MdCheckboxModule, MdListModule, ReactiveFormsModule, MaterialModule, MdSnackBarModule, HttpModule ],
  providers: [ MdIconRegistry, AccountService ],
  declarations: [ MainComponent, NotFound, HomeComponent, LogNavComponent, LoginComponent ],
  bootstrap: [ MainComponent ]
})
export class InitModule { }

platformBrowserDynamic().bootstrapModule(InitModule);