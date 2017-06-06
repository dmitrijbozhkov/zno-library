import { Component, forwardRef, Input, OnInit, ViewChild } from "@angular/core";
import { ControlValueAccessor, Validator, FormControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from "@angular/forms";

@Component({
    selector: "file-input",
    template: `
    <md-grid-list cols="3" rowHeight="48px">
        <md-grid-tile><md-icon>insert_drive_file</md-icon><h3>{{ label }}</h3></md-grid-tile>
        <md-grid-tile> {{ value.length > 0 ? value.item(0).name : "Выберите файл" }} </md-grid-tile>
        <input [hidden]="true" #input type="file" (change)="onChange($event)">
        <md-grid-tile>
            <button md-raised-button class="clean-login account" (click)="onCancel($event)" type="button"><md-icon>clear</md-icon>Очистить</button>
            <button md-raised-button class="send-login" (click)="onload($event)" type="button"><md-icon>file_upload</md-icon>Загрузить</button>
        </md-grid-tile>
    </md-grid-list>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileInputComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FileInputComponent),
            multi: true
    }]
})
export class FileInputComponent implements ControlValueAccessor, Validator, OnInit {
    @ViewChild("input") public input: any;
    @Input() public label: string;

    public value: FileList;
    public propagateChange: (event: FileList) => void;

    public ngOnInit() {
        this.value = { length: 0 } as any;
    }

    public onChange(event: UIEvent) {
        this.value = (event.target as any).files;
        this.propagateChange(this.value);
    }

    /**
     * Propagates click to file input
     * @param event Click event
     */
    public onload(event: UIEvent) {
        event.preventDefault();
        this.input.nativeElement.click();
    }

    /**
     * Cleans file input
     * @param event Click event
     */
    public onCancel(event: UIEvent) {
        event.preventDefault();
        this.input.nativeElement.value = "";
    }

    /**
     * Write a new value to the element.
     */
    public writeValue(files: FileList): void {
        this.value = files;
    }
    /**
     * Set the function to be called
     * when the control receives a change event.
     */
    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }
    /**
     * Set the function to be called
     * when the control receives a touch event.
     */
    public registerOnTouched(fn: any): void {}

    public validate(control: FormControl) {
        return {};
    }
}