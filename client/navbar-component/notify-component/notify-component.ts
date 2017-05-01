import { VNode, div, i, a, span } from "@cycle/dom";
import { Stream } from "xstream";
import { load_component } from "./load-component";
import delay from "xstream/extra/delay";

/**
 * Stream of loading events
 */
export type loadNotify = Stream<[boolean, VNode]>;

/**
 * Types of notifications
 */
export enum NotificationTypes {
    "info",
    "error"
}

/**
 * Notification object
 */
export interface INotification {
    message: VNode;
    type: string;
}

/**
 * Removes notification
 */
export interface IStopNotify {
    stop: boolean;
}

/**
 * Notifications
 */
export type QueueNotification = INotification | IStopNotify;

/**
 * Shows loading to user
 * @param messages$ Stream of loading events
 */
export function notify_component(load$: loadNotify, notifications$: Stream<INotification>) {
    let load_view$ = load$.compose(load_component);
    let looped_queue$ = notifications$.compose(loop_drop);
    let notify_view$ = looped_queue$.compose(notifications_view);
    let combined_view$ = combine_views(load_view$, notify_view$);
    return combined_view$.compose(global_view);
}

/**
 * Queues notifications
 * @param stream$ Stream of notification messages
 */
export function notify_queue(stream$: Stream<QueueNotification>) {
    let notifications = [];
    return stream$
    .map((notify) => {
        if ((notify as IStopNotify).stop) {
            notifications.shift();
        } else {
            notifications.push(notify as INotification);
        }
        return notifications;
    })
    .startWith(notifications);
}

/**
 * Delays the removal of notification
 * @param stream$ Stream of notifications
 */
export function delay_remove(stream$: Stream<QueueNotification>) {
    return stream$
    .compose(delay(6000))
    .mapTo({ stop: true });
}

/**
 * Maintains array of notifications and drops them after 3 seconds
 * @param source$ Source of notifications
 */
export function loop_drop(source$: Stream<INotification>) {
    let drop_proxy$ = Stream.create();
    let queue_events$ = Stream.merge(source$, drop_proxy$);
    let queue$ = queue_events$.compose(notify_queue);
    let drop$ = source$.compose(delay_remove);
    drop_proxy$.imitate(drop$);
    return queue$;
}

/**
 * Maps queue to view
 * @param stream$ Stream of queues
 */
export function notifications_view(stream$: Stream<QueueNotification[]>) {
    return stream$
    .map((notifications) => {
        let views = notifications.map((notify: INotification) => {
            let notify_type = notify.type === NotificationTypes[0] ? ".notify-info" : ".notify-error";
            let notify_icon = notify.type === NotificationTypes[0] ? ".fa.fa-exclamation-circle" : ".fa.fa-exclamation-triangle";
            return div(".notify-wrapper" + notify_type, {}, [
                div(".notify-content.notify-item", {}, notify.message),
                div(".notify-icon.notify-item", {}, i(notify_icon, { attrs: { "aria-hidden": "true" } }))
            ]);
        });
        return div("#notify-wrapper", {}, views);
    });
}

/**
 * Combines views
 * @param load_view$ Stream of loading views
 * @param notify_view$ Stream of notiication views
 */
export function combine_views(load_view$: Stream<VNode>, notify_view$: Stream<VNode>) {
    return Stream.combine(load_view$, notify_view$);
}

/**
 * Maps views to combined views
 * @param combined_view$ Stream of combined views
 */
export function global_view(combined_view$: Stream<[VNode, VNode]>) {
    return combined_view$
    .map((views) => {
        return div("#notifications-wrapper", {}, views);
    });
}