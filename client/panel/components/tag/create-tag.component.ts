import { MdSnackBar, MdDialog, MdDialogRef, MD_DIALOG_DATA } from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";
import { ITag } from "../course/add-course-tag.component";
import { FormBuilder, FormGroup } from "@angular/forms";

export enum CreateTagOptions {
    "Submit",
    "Cancel"
}

@Component({
    selector: "create-tag",
    template: `
    <h2 md-dialog-title>Добавить тег</h2>
    <md-dialog-content>
        <form [formGroup]="addTag" >
            <md-input-container>
                    <input mdInput placeholder="Имя тега" type="text" formControlName="tagName" />
            </md-input-container>
        </form>
    </md-dialog-content>
    <md-dialog-actions>
        <button md-button (click)="submitTag()">Добавить</button>
        <button md-button (click)="cancelTag()">Отменить</button>
    </md-dialog-actions>
    `
})
export class CreateTagDialog {
    private dialog: MdDialogRef<CreateTagDialog>;
    public addTag: FormGroup;
    constructor(dialog: MdDialogRef<CreateTagDialog>, fb: FormBuilder, @Inject(MD_DIALOG_DATA) data: string) {
        this.dialog = dialog;
        this.addTag = fb.group({
            tagName: [data]
        });
    }

    /**
     * Passes tag data to main controller
     */
    public submitTag() {
        let tagName = this.addTag.controls.tagName.value;
        this.dialog.close({ name: tagName, action: CreateTagOptions[0]});
    }

    /**
     * Cancels tag creation
     */
    public cancelTag() {
        this.dialog.close({ action: CreateTagOptions[1] });
    }
}