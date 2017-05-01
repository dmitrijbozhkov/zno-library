import * as assert from "assert";
import { Stream } from "xstream";
import { div, i, a } from "@cycle/dom";
import { notify_queue, INotification, IStopNotify, NotificationTypes, delay_remove, loop_drop, notifications_view, combine_views, global_view } from "../../../navbar-component/notify-component/notify-component";
import { load_view } from "../../../navbar-component/notify-component/load-component";
import delay from "xstream/extra/delay";

describe("notify_component queue", () => {
    it("notify_queue should start with empty array", () => {
        let stream$ = Stream.never();
        let expected = [];
        stream$
        .compose(notify_queue)
        .addListener({
            next: (actual) => {
                assert.deepEqual(actual, expected);
            }
        });
    });
    it("notify_queue should push notification to array if INotification message emitted", () => {
        let expected = [{ message: div("#not"), type: NotificationTypes[0] }];
        let stream$ = Stream.of(expected[0]);
        stream$
        .compose(notify_queue)
        .drop(1)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        })
    });
    it("notify_queue should remove first notification from array if IStopNotify message emitted", () => {
        let expected = [{ message: div("#not"), type: NotificationTypes[0] }];
        let stream$ = Stream.of<any>({ message: div("#yep"), type: NotificationTypes[1] }, expected[0], { stop: true });
        stream$
        .compose(notify_queue)
        .drop(3)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
    it("notify_queue shouln't return array of notifications if IStopNotify message emitted", () => {
        let expected = [];
        let stream$ = Stream.of<any>({ message: div("#yep"), type: NotificationTypes[1] }, { stop: true });
        stream$
        .compose(notify_queue)
        .drop(2)
        .addListener({
            next: (actual) => {
                assert.deepEqual(actual, expected);
            }
        });
    });
    it.skip("delay_remove should should delay event and map it to IStopNotify", function(done) {
        let stream$ = Stream.of<any>([]);
        this.timeout(4000);
        stream$
        .compose(delay_remove)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, { stop: true });
                done();
            }
        });
    });
    it.skip("loop_drop should drop notification after 3 seconds ", function(done) {
        let expected = [];
        let messages$ = Stream.of<any>({ message: div("#lel"), type: NotificationTypes[0] });
        this.timeout(4000);
        messages$
        .compose(loop_drop)
        .drop(2)
        .addListener({
            next: (actual) => {
                assert.deepEqual(actual, expected);
                done();
            }
        });
    });
    it("notifications_view should map array of notifications to view", () => {
        let message = { message: div("#lel"), type: NotificationTypes[0] };
        let expected = div("#notify-wrapper", {}, [
            div(".notify-wrapper" + ".notify-info", {}, [
                div(".notify-content.notify-item", {}, message.message),
                div(".notify-icon.notify-item", {}, i(".fa.fa-exclamation-circle", { attrs: { "aria-hidden": "true" } }))
            ])
        ]);
        let notifications$ = Stream.of([message]);
        notifications$
        .compose(notifications_view)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
    it("combine_views should combine notifications and loading views into array", () => {
        let expected = [1, 2];
        let notifications$ = Stream.of(1);
        let load$ = Stream.of(2);
        let composed = combine_views(notifications$ as any, load$ as any);
        composed
        .addListener({
            next: (actual) => {
                assert.deepEqual(actual, expected);
            }
        });
    });
    it("global_view should take array of views and map them to div wrapper", () => {
        let view = [ div(".one"), div(".two") ];
        let expected = div("#notifications-wrapper", {}, view);
        let input$ = Stream.of(view);
        input$
        .compose(global_view)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
    it("load_view should map loadNotify stream to view", () => {
        let message = div("#stuff");
        let expected = div("#load-wrapper", { attrs: { "data-state": "load-open" } }, [
            div(".load-content.load-item", {}, message),
            div(".load-icon.load-item", {}),
            a(".load-cancel.load-item", { attrs: { href: "#" } }, [
                i(".fa.fa-times", { attrs: { "aria-hidden": "true" } })
            ])
        ]);
        let load$ = Stream.of([true, message]);
        load$
        .compose(load_view)
        .addListener({
            next: (actual) => {
                assert.deepEqual(actual, expected);
            }
        });
    });
});