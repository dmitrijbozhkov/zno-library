import { Component } from "@angular/core";

@Component({
    selector: "main",
    template: `
    <md-sidenav-container class="side-wrapper">
        <md-sidenav #sidenav class="nav-toolbar">
            <md-toolbar class="nav-toolbar">
                <button md-raised-button routerLink="/" (click)="sidenav.close()"><i class="material-icons">home</i>Домой</button>
                <md-toolbar-row><button md-raised-button routerLink="/search" (click)="sidenav.close()"><i class="material-icons">search</i>Поиск</button></md-toolbar-row>
                <md-toolbar-row><button md-raised-button routerLink="/course" (click)="sidenav.close()"><i class="material-icons">library_books</i>Курсы</button></md-toolbar-row>
            </md-toolbar>
        </md-sidenav>
        <md-toolbar class="nav-toolbar" layout="row">
            <button md-icon-button (click)="sidenav.open()"><i class="material-icons toggler">reorder</i></button>
            <span class="space"></span>
            <logNav></logNav>
        </md-toolbar>
        <div class="content"><router-outlet></router-outlet></div>
    </md-sidenav-container>`
})
export class MainComponent { name = "<p>stuff in here</p>"; }