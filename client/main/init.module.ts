/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />

import "zone.js/dist/zone";
import "reflect-metadata";

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { MainComponent } from "./main.component";

@NgModule({
  imports:      [ BrowserModule, BrowserAnimationsModule ],
  declarations: [ MainComponent ],
  bootstrap:    [ MainComponent ]
})
export class InitModule { }

platformBrowserDynamic().bootstrapModule(InitModule);