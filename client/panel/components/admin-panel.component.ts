import { Component } from "@angular/core";

@Component({
    selector: "admin-panel",
    template: `
    <md-card class="course-history-item">
        <md-card-header>
            <md-card-title><h2>Управление ролями пользователей</h2></md-card-title>
        </md-card-header>
        <md-card-actions>
            <button md-button color="accent" routerLink="manage/">Перейти к управлению ролями</button>
        </md-card-actions>
    </md-card>
    `
})
export class AdminPanelComponent {}