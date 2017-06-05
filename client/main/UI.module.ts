import { NgModule } from "@angular/core";
import {
    MdToolbarModule,
    MdButtonModule,
    MdSidenavModule,
    MdIconModule,
    MdInputModule,
    MdCheckboxModule,
    MdListModule,
    MaterialModule,
    MdSnackBarModule,
    MdProgressBarModule,
    MdTabsModule,
    MdCardModule,
    MdMenuModule,
    MdDialogModule,
    MdGridListModule
} from "@angular/material";
import { MdIconRegistry } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
    imports: [
        MdToolbarModule,
        MdButtonModule,
        MdSidenavModule,
        MdInputModule,
        MdCheckboxModule,
        MdListModule,
        MaterialModule,
        MdSnackBarModule,
        BrowserAnimationsModule,
        BrowserModule,
        MdProgressBarModule,
        MdTabsModule,
        MdCardModule,
        MdMenuModule,
        MdDialogModule,
        MdGridListModule
    ],
    exports: [
        MdToolbarModule,
        MdButtonModule,
        MdSidenavModule,
        MdInputModule,
        MdCheckboxModule,
        MdListModule,
        MaterialModule,
        BrowserAnimationsModule,
        MdSnackBarModule,
        BrowserModule,
        MdProgressBarModule,
        MdTabsModule,
        MdCardModule,
        MdMenuModule,
        MdDialogModule,
        MdGridListModule
    ],
    providers: [ MdIconRegistry ]
})
export class UIModule {}

