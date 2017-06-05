import { Component, OnInit, Output } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { Utils } from "../../../main/utils/utils";
import { MdSnackBar, MdDialog } from "@angular/material";
import { Router } from "@angular/router";
import { AddCourseService } from "../../services/add-course.service";
import { IErrorMessages } from "../../../main/inputs/reactive-input.component";

export const errList: IErrorMessages = {
    required: "Поле обязательно для заполнения",
    nameError: "Данное имя уже занято"
};

export interface IIdError {
    isErr: boolean;
    message: string;
}

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
                    <md-list-item class="form-input form-item">
                        <reactive-input [group]="addCourse" [errorList]="errList" [controlName]="'name'" [type]="'text'" [placeholder]="'Название курса'" required="true">
                        </reactive-input>
                    </md-list-item>
                    <add-tag></add-tag>
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
    private fb: FormBuilder;
    private snackbar: MdSnackBar;
    private dialog: MdDialog;
    // form
    @Output() public addCourse: FormGroup;
    @Output() public errList: IErrorMessages;
    constructor(utils: Utils, manager: AddCourseService, fb: FormBuilder, snackbar: MdSnackBar, dialog: MdDialog) {
        this.utils = utils;
        this.manager = manager;
        this.fb = fb;
        this.snackbar = snackbar;
        this.dialog = dialog;
        this.errList = errList;
    }

    /**
     * Initializes component
     */
     public ngOnInit() {
        this.initForm();
    }

    /**
     * Initializes form
     */
    public initForm() {
        this.addCourse = this.fb.group({
            name: this.fb.control("", [ Validators.required ])
        });
    }

    /**
     * Checks course name
     */
    public checkCourseName() {
        let nameControl = this.addCourse.controls.name;
        if (nameControl.value) {
            this.manager.addCourseName(nameControl.value)
            .subscribe((id) => {
                nameControl.setErrors({});
                nameControl.setValue(nameControl.value);
            }, (err) => {
                nameControl.setErrors({
                    nameError: true
                });
            });
        }
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