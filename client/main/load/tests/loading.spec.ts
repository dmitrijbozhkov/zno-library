import { LoadingService } from "../../../main/load/loading.service";

describe("LoadingService tests", () => {
    let service: LoadingService;
    beforeEach(() => {
        service = new LoadingService();
    });
    it("LoadingService should be initialized with busy = false and progress = 100", (done) => {
        let expected = { busy: false, progress: 100 };
        service.state.subscribe((actual) => {
            expect(actual).toEqual(expected);
            done();
        });
    });
    it("onStart should pass next state with busy = true and progress = 10", (done) => {
        let expected = { busy: true, progress: 10 };
        service.onStart();
        service.state.subscribe((actual) => {
            expect(actual).toEqual(expected);
            done();
        });
    });
    it("onEnd should pass next state with busy = false and progress = 100", (done) => {
        let expected = { busy: false, progress: 100 };
        service.onEnd();
        service.state.subscribe((actual) => {
            expect(actual).toEqual(expected);
            done();
        });
    });
    it("onComplete should pass next with busy = true and progress equal to passed progress", (done) => {
        let expected = { busy: true, progress: 69 };
        service.onComplete(69);
        service.state.subscribe((actual) => {
            expect(actual).toEqual(expected);
            done();
        });
    });
});