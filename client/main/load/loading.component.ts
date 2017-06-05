import { Component } from "@angular/core";
import { LoadingService, LoadingState } from "./loading.service";
import { MdProgressBar } from "@angular/material";

@Component({
    selector: "loading",
    template: `
    <div [class.loader-hidden]="!show">
        <div class="loader-overlay">
            <div>
                <md-progress-bar mode="determinate" color="warn" [value]="progress" *ngIf="show"></md-progress-bar>
            </div>
        </div>
    </div>
    `,
})
export class LoadingComponent {
    public show: boolean;
    public progress: number;
    constructor(private loading: LoadingService) {
        this.initProgress();
    }

    /**
     * Subscribes to LoadingService state subject
     */
    private initProgress() {
        this.loading.state.subscribe((state) => {
            this.show = state.busy;
            this.progress = state.progress;
        });
    }
}