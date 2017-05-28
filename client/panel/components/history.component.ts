import { Component, OnInit } from "@angular/core";
import { HistoryService, ICourseHistory } from "../services/history.service";

@Component({
    selector: "history",
    template: `
    <h2>История</h2>
    <md-card *ngFor="let course of courses" class="course-history-item">
        <md-card-header>
            <md-card-title>{{ course.courseName }}</md-card-title>
        </md-card-header>
        <md-card-content>
            <md-progress-bar [value]="course.completed"></md-progress-bar>
        </md-card-content>
        <md-card-actions>
            <button md-button routerLink="{{'../../course/' + course.courseId}}">Просмотреть курс</button>
            <button md-button routerLink="{{'course/' + course.courseId}}">Пройденные главы</button>
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