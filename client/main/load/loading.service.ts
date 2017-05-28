import { Injectable, Inject } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { Observable } from "rxjs";

export type LoadingState = {
    busy: boolean;
    progress: number;
};

@Injectable()
export class LoadingService {
    public state: ReplaySubject<LoadingState>;
    constructor() {
        this.state = new ReplaySubject(1);
        this.onEnd();
    }

    /**
     * Notifies progress bar of starting work
     */
    public onStart() {
        this.state.next({ busy: true, progress: 10 });
    }

    /**
     * Notifies progress bar of ending work
     */
    public onEnd() {
        this.state.next({ busy: false, progress: 100 });
    }

    /**
     * Notifies progress bar of completing work
     */
    public onComplete(progress: number) {
        this.state.next({ busy: true, progress: progress });
    }
}