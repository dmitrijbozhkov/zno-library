import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Utils, ErrorInput, IErrorMessages, buildInput } from "../../../main/utils/utils";
import { Router } from "@angular/router";
import { AddCourseService } from "../../services/add-course.service";

const errList: IErrorMessages = {
    required: "Поле обязательно для заполнения"
};

@Component({
    selector: "add-course",
    template: `
    <md-card class="course-history-item">
        <md-card-header>
            <md-card-title><h2>Добавить Курс</h2></md-card-title>
        </md-card-header>
        <md-card-content>
            <form [formGroup]="addCourse" (ngSubmit)="submitForm($event, login.value)">
                <md-list>
                    <md-list-item>
                        <md-input-container>
                            <input mdInput required placeholder="Название курса" type="text" formControlName="name" />
                            <md-error *ngIf="nameInput.isErr">{{ nameInput.errorMessage }}</md-error>
                        </md-input-container>
                    </md-list-item>
                </md-list>
            </form>
        </md-card-content>
    </md-card>
    `
})
export class AddCourseComponent implements OnInit {
    // services
    private utils: Utils;
    private manager: AddCourseService;
    private inputFactory: buildInput;
    private fb: FormBuilder;
    // form
    public addCourse: FormGroup;
    public nameInput: ErrorInput;
    constructor(utils: Utils, manager: AddCourseService, fb: FormBuilder) {
        this.utils = utils;
        this.manager = manager;
        this.inputFactory = utils.inputFactory(fb);
        this.fb = fb;
    }

    /**
     * Initializes component
     */
    ngOnInit() {
        this.initForm();
    }

    /**
     * Initializes form
     */
    initForm() {
        this.nameInput = this.inputFactory("", [ Validators.required ], errList);
        this.addCourse = this.fb.group({
            name: this.nameInput.element
        });
    }

    /**
     * Handles form submit
     */
    submitForm() {}

    /**
     * Handles form reset
     */
    resetForm() {}
}