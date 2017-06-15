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
            <form [formGroup]="addCourse" (ngSubmit)="submitForm($event, addCourse.value)">
                <md-list>
                    <md-list-item class="form-input form-item">
                        <reactive-input (refresh)="checkCourseName()" [hintList]="nameIsValid" [group]="addCourse" [errorList]="errList" [controlName]="'name'" [type]="'text'" [placeholder]="'Название курса'" required="true">
                        </reactive-input>
                    </md-list-item>
                    <add-tag></add-tag>
                    <md-divider></md-divider>
                    <file-input [label]="'Картинка курса:'" formControlName="banner"></file-input>
                    <md-divider></md-divider>
                    <file-input [label]="'Текст описания:'" formControlName="description"></file-input>
                    <md-divider></md-divider>
                    <file-input [label]="'Текст вводной части'" formControlName="intro"></file-input>
                    <md-divider></md-divider>
                    <md-list-item>
                        <h3>Главы:</h3>
                    </md-list-item>
                    <md-list>
                        <md-list-item *ngFor="let chapter of manager.courseChapters" >
                        </md-list-item>
                        <md-grid-list cols="1" rowHeight="48px">
                            <md-grid-tile>
                                <button md-raised-button routerLink="chapter" type="button"><md-icon>note_add</md-icon>Добавить главу</button>
                            </md-grid-tile>
                        </md-grid-list>
                    </md-list>
                </md-list>
                <button md-raised-button class="send-login" type="submit">Отправить</button>
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
    @Output() public nameIsValid: string[];
    constructor(utils: Utils, manager: AddCourseService, fb: FormBuilder, snackbar: MdSnackBar, dialog: MdDialog) {
        this.utils = utils;
        this.manager = manager;
        this.fb = fb;
        this.snackbar = snackbar;
        this.dialog = dialog;
        this.errList = errList;
        this.nameIsValid = [];
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
    private initForm() {
        this.addCourse = this.fb.group({
            name: this.fb.control("", [ Validators.required ]),
            banner: this.fb.control(""),
            description: this.fb.control(""),
            intro: this.fb.control("")
        });
    }

    /**
     * Handles course adding response
     * @param control Course name control
     */
    private addCourseHandler(control: AbstractControl) {
        let message = "Название курса свободно";
        control.setErrors({});
        control.setValue(control.value);
        let index = this.nameIsValid.indexOf(message);
        if (index === -1) {
            this.nameIsValid.push(message);
        }
    }

    /**
     * Handles course adding error
     * @param control Course name control
     */
    private addCourseError(control: AbstractControl) {
        let message = "Название курса свободно";
        control.setErrors({
            nameError: true
        });
        let index = this.nameIsValid.indexOf(message);
        if (index === -1) {
            this.nameIsValid.pop();
        }
    }

    /**
     * Checks course name
     */
    public checkCourseName() {
        let nameControl = this.addCourse.controls.name;
        if (nameControl.value) {
            this.manager.addCourseName(nameControl.value)
            .subscribe((id) => {
                this.addCourseHandler(nameControl);
            }, (err) => {
                this.addCourseError(nameControl);
            });
        }
    }

    /**
     * Handles form submit
     */
    submitForm(event: UIEvent, value: any) {
        event.preventDefault();
        console.log(event, value);
    }

    /**
     * Handles form reset
     */
    resetForm() {}
}