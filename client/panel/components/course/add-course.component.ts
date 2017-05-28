import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Utils, ErrorInput, IErrorMessages, buildInput } from "../../../main/utils/utils";
import { Router } from "@angular/router";

@Component({
    selector: "add-course",
    template: `
    <md-card class="course-history-item">
        <md-card-header>
            <md-card-title><h1>Добавить Курс</h1></md-card-title>
        </md-card-header>
        <md-card-content>
            <p>form here</p>
        </md-card-content>
    </md-card>
    `
})
export class AddCourseComponent {
    private utils: Utils;
    constructor() {}
}