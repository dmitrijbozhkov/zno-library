/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />

import "zone.js/dist/zone";
import "reflect-metadata";

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { MainComponent } from "./main.component";
import { NotFound } from "./notFound.component";
import { HomeComponent } from "./home.component";
import { Router } from "./router.module";

import { MdToolbarModule, MdButtonModule, MdSidenavModule, MdIconModule } from "@angular/material";
import { MdIconRegistry } from "@angular/material";

@NgModule({
  imports: [ BrowserModule, BrowserAnimationsModule, Router, MdToolbarModule, MdButtonModule, MdSidenavModule ],
  providers: [ MdIconRegistry ],
  declarations: [ MainComponent, NotFound, HomeComponent ],
  bootstrap: [ MainComponent ]
})
export class InitModule { }

platformBrowserDynamic().bootstrapModule(InitModule);