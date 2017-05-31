import { Component } from "@angular/core";

@Component({
    selector: "teacher-panel",
    template: `
    <md-card class="course-history-item">
        <md-card-header>
            <md-card-title><h2>Курсы</h2></md-card-title>
        </md-card-header>
        <md-card-actions>
            <button md-button color="accent" routerLink="../course/add/">Добавить курс</button>
            <button md-button color="warn" routerLink="../course/remove">Удалить курс</button>
        </md-card-actions>
    </md-card>
    <md-card class="course-history-item">
        <md-card-header>
            <md-card-title><h2>Ученики</h2></md-card-title>
        </md-card-header>
        <md-card-actions>
            <button md-button color="accent" routerLink="../history/students/">Просмотреть историю</button>
        </md-card-actions>
    </md-card>
    `
})
export class TeacherPanelComponent {}