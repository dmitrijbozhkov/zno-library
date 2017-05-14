import { Component } from "@angular/core";

@Component({
    selector: "main",
    template: `
    <md-sidenav-container class="side-wrapper">
        <md-sidenav #sidenav>
            <md-toolbar class="nav-toolbar">
                <button md-raised-button routerLink="/" (click)="sidenav.close()"><i class="material-icons">home</i>Home</button>
                <md-toolbar-row><button md-raised-button routerLink="/search" (click)="sidenav.close()"><i class="material-icons">search</i>Search</button></md-toolbar-row>
                <md-toolbar-row><button md-raised-button routerLink="/course" (click)="sidenav.close()"><i class="material-icons">library_books</i>Courses</button></md-toolbar-row>
            </md-toolbar>
        </md-sidenav>
        <md-toolbar layout="row">
            <button md-icon-button (click)="sidenav.open()"><i class="material-icons">reorder</i></button>
            <span class="space"></span>
            <button md-raised-button routerLink="/user" class="account"><i class="material-icons">account_box</i> Account</button>
            <button md-raised-button routerLink="/login">Login</button>
        </md-toolbar>
        <div class="content"><router-outlet></router-outlet></div>
    </md-sidenav-container>`
})
export class MainComponent { name = "<p>stuff in here</p>"; }