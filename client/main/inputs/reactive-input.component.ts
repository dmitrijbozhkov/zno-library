import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from "@angular/core";
import { FormGroup, AbstractControl } from "@angular/forms";
import { Subscription } from "rxjs";

/**
 * List of error messages
 */
export interface IErrorMessages {
    [error: string]: string;
}

@Component({
    selector: "reactive-input",
    template: `
    <md-input-container [formGroup]="group" (click)="refreshErr()">
        <input mdInput (blur)="onRefresh($event)" required="{{required}}" placeholder="{{placeholder}}" type="{{type}}" [formControl]="control" />
        <md-error *ngIf="control.invalid">{{ errorMessage }}</md-error>
        <md-hint *ngFor="let hint of hintList">{{ hint }}</md-hint>
    </md-input-container>
    `
})
export class ReactiveInputComponent implements OnInit, OnDestroy {
    @Input() public group: FormGroup;
    @Input() public errorList: IErrorMessages;
    @Input() public hintList: string[];
    @Input() public controlName: string;
    @Input() public type: string;
    @Input() public placeholder: string;
    @Input() public required: boolean;

    public changes: Subscription;
    public control: AbstractControl;
    public errorMessage: string;

    @Output() refresh: EventEmitter<UIEvent>;

    constructor() {
        this.refresh = new EventEmitter();
    }

    public onRefresh(event: UIEvent) {
        this.refresh.emit(event);
    }

    /**
     * Initializes input handling
     */
    public ngOnInit() {
        this.control = this.group.controls[this.controlName];
        this.changes = this.control.statusChanges.subscribe((value) => {
            this.refreshErr();
        });
    }

    /**
     * Shows first input error
     */
    public refreshErr() {
        if (this.control.invalid) {
            let key = Object.keys(this.control.errors)[0];
            this.errorMessage = this.errorList[key] ? this.errorList[key] : key;
        }
    }

    /**
     * Destroys input handling
     */
    public ngOnDestroy() {
        this.control = null;
        this.changes.unsubscribe();
    }
}