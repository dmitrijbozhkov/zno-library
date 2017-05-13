import { Component } from "@angular/core";

@Component({
    selector: "main",
    template: "<h1 [innerHTML]='name' ></h1>"
})
export class MainComponent { name = "<p>stuff in here</p>"; }