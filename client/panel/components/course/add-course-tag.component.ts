import { Component, OnInit } from "@angular/core";
import { AddCourseService } from "../../services/add-course.service";
import { MdDialog, MdDialogRef } from "@angular/material";
import { CreateTagDialog, CreateTagOptions } from "../tag/create-tag.component";

export interface ITag {
    id: number;
    name: string;
}

@Component({
    selector: "add-tag",
    template: `
    <md-grid-list cols="5" rowHeight="48px">
        <md-grid-tile><h3>Теги:</h3></md-grid-tile>
        <md-grid-tile *ngFor="let tag of manager.courseTags">
            <md-icon>label</md-icon>{{ tag.name }}<button md-icon-button type="button" (click)="removeTag(tag)"><md-icon>clear</md-icon></button>
        </md-grid-tile>
        <md-grid-tile>
            <button md-icon-button [mdMenuTriggerFor]="tagMenu" type="button" (click)="openTagMenu($event)"><md-icon>local_hospital</md-icon></button>
        </md-grid-tile>
    </md-grid-list>
    <md-menu #tagMenu="mdMenu" class="tagMenu">
        <div md-menu-item disabled>
            <md-input-container>
                <input mdInput placeholder="Найти тег" type="text" (input)="pushSearch($event)" (blur)="clearTagSearch($event)" />
            </md-input-container>
        </div>
        <button md-menu-item (click)="newTag($event)"><md-icon>note_add</md-icon> Добавить тег</button>
        <button *ngFor="let tag of selectTags" (click)="addTag(tag)" md-menu-item>{{ tag.name }}</button>
    </md-menu>
    `
})
export class AddCourseTagComponent {
    private dialog: MdDialog;
    public manager: AddCourseService;
    public selectTags: ITag[];
    public searchTags: ITag[];
    constructor(manager: AddCourseService, dialog: MdDialog) {
        this.manager = manager;
        this.dialog = dialog;
        this.selectTags = [];
        this.searchTags = [];
    }

    /**
     * Searches for tag in tag collection
     * @param collection Tag collection
     * @param tag Tag to search
     */
    private indexOfTag(collection: ITag[], tag: ITag) {
        let index = -1;
        for (let i = 0; i < collection.length; i += 1) {
            if (collection[i].name === tag.name) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * Pushes all tags that aren't in courseTags into avalibleTags
     * @param tags Array of new tags
     */
    private arrangeTags(tags: ITag[]) {
        this.selectTags = [];
        this.searchTags = [];
        tags.forEach((tag) => {
            if (this.indexOfTag(this.manager.courseTags, tag) === -1) {
                this.selectTags.push(tag);
                this.searchTags.push(tag);
            }
        });
    }

    /**
     * Handles error responses
     * @param error Error response
     */
    private handleError(error: any) {
        console.error(error);
    }

    /**
     * Opens menu of avalible tags
     */
    public openTagMenu(event: UIEvent) {
        event.preventDefault();
        this.manager.getTags().subscribe((tags: ITag[]) => {
            this.arrangeTags(tags);
        }, (err) => {
            this.handleError(err);
        });
    }

    /**
     * Adds new tag to list of course tags
     * @param tag Tag info
     */
    public addTag(tag: ITag) {
        this.manager.courseTags.push(tag);
        let index = this.indexOfTag(this.selectTags, tag);
        this.selectTags.splice(index, 1);
        console.log(this.selectTags);
    }

    /**
     * Removes tag from course
     * @param tag Tag to remove
     */
    public removeTag(tag: ITag) {
        let index = this.indexOfTag(this.manager.courseTags, tag);
        this.manager.courseTags.splice(index, 1);
        this.selectTags.push(tag);
    }

    /**
     * Clears tags search bar
     * @param event Blur event
     */
    public clearTagSearch(event: UIEvent) {
        (event.target as HTMLInputElement).value = "";
    }

    /**
     * Adds new tag for courses
     * @param event New tag event
     */
    public newTag(event: UIEvent) {
        let dialog = this.dialog.open(CreateTagDialog, { data: "" });
        dialog.afterClosed().subscribe((dialog) => {
            if (dialog.action === CreateTagOptions[0]) {
                this.manager.addTag(dialog.name);
            }
        });
    }

    /**
     * Searches tag
     * @param event Input chenge event
     */
    public pushSearch(event: UIEvent) {
        let search = new RegExp((event.target as any).value, "i");
        this.selectTags = this.searchTags.filter((tag) => {
            return tag.name.match(search);
        });
    }
}