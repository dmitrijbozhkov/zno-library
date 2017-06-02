import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Utils, ErrorInput, IErrorMessages, buildInput } from "../../../main/utils/utils";
import { Router } from "@angular/router";
import { AddCourseService } from "../../services/add-course.service";

const errList: IErrorMessages = {
    required: "Поле обязательно для заполнения"
};

export interface ITag {
    id: number;
    name: string;
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
                        <md-input-container>
                            <input mdInput required placeholder="Название курса" type="text" formControlName="name" />
                            <md-error *ngIf="nameInput.isErr">{{ nameInput.errorMessage }}</md-error>
                        </md-input-container>
                    </md-list-item>
                    <md-list-item>
                        <div>Теги: </div>
                        <div *ngFor="let tag of courseTags"> {{ tag.name }} </div>
                        <button md-icon-button [mdMenuTriggerFor]="tagMenu" type="button"><md-icon>local_hospital</md-icon></button>
                        <md-menu #tagMenu="mdMenu" class="tagMenu">
                            <div md-menu-item disabled>
                                <md-input-container>
                                    <input mdInput placeholder="Найти тег" type="text"/>
                                </md-input-container>
                            </div>
                            <button md-menu-item><md-icon>note_add</md-icon> Добавить тег</button>
                            <button *ngFor="let tag of tags" (click)="addTag(tag)" md-menu-item>{{ tag.name }}</button>
                        </md-menu>
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
    // tags
    public courseTags: ITag[];
    public tags: ITag[];
    constructor(utils: Utils, manager: AddCourseService, fb: FormBuilder) {
        this.utils = utils;
        this.manager = manager;
        this.inputFactory = utils.inputFactory(fb);
        this.fb = fb;
        this.courseTags = [];
        this.tags = [ { id: 1, name: "Math" }, { id: 2, name: "Literature" } ];
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
     * Opens menu of avalible tags
     */
    public openTagMenu(event) {
        console.log("open");
        event.preventDefault();
    }

    public addTag(tag) {
        console.log(tag);
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