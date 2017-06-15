import { Component, OnInit } from "@angular/core";
import { HistoryService, ICourseHistory } from "../services/history.service";

@Component({
    selector: "history",
    template: `
    <md-card class="course-history-item">
        <md-card-header>
            <md-card-title><h2>История</h2></md-card-title>
        </md-card-header>
        <md-card-actions>
            <button md-button color="accent" routerLink="/courses">Добавить курс</button>
            <button md-button color="warn" routerLink="/latest">Удалить курс</button>
        </md-card-actions>
    </md-card>
    `
})
export class HistoryComponent implements OnInit {
    public courses: ICourseHistory[];
    constructor(private history: HistoryService) {
        this.courses = [];
    }

    public ngOnInit() {
        this.history.latestHsitory(1, 5).subscribe((pages) => {
            this.courses = this.courses.concat(pages);
        });
    }
}