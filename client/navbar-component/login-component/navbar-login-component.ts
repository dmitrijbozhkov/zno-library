import { DOMSource, VNode, div, span, a, i } from "@cycle/dom";
import { Stream } from "xstream";

/**
 * User logged in
 */
export type user = [ boolean, string, string ];

/**
 * User isn't logged in
 */
export type guest = [ boolean ];

/**
 * States of log in
 */
export type loginStates = Stream<guest | user>;

/**
 * Gets login state and returns navbar login view
 * @param loginState$ State of login
 */
export function navbar_login_component(loginState$: loginStates) {
    let users$ = filter_user_state(loginState$, true);
    let guests$ = filter_user_state(loginState$, false);
    return navbar_login_view(users$ as any, guests$ as any);
}

/**
 * Filters user states
 * @param stream Stream of account states
 * @param expected_state State of user (logged in or not)
 */
export function filter_user_state(stream: loginStates, expected_state: boolean) {
    return stream
    .filter((state) => {
        return state[0] === expected_state;
    });
}

/**
 * Takes login states and returns login panel view
 * @param users$ Stream of user states
 * @param guests$ Stream of guest states
 */
export function navbar_login_view(users$: Stream<user>, guests$: Stream<guest>) {
    let user_view$ = users$.compose(user_view);
    let guest_view$ = guests$.compose(guest_view);
    let merged_views = merge_views(user_view$, guest_view$);
    return merged_views.compose(view);
}

/**
 * Maps user state to view
 * @param stream$ Stream of user states
 */
export function user_view(stream$: Stream<user>) {
    return stream$
    .map((state) => {
        return [
            a(".user-button", { attrs: { href: "/user" } }, [
                i(".fa.fa-user", { attrs: { "aria-hidden": "true" } }),
                span(".user-name", {}, `  ${state[1]} ${state[2]}`)
            ]),
            a(".user-logoff", { attrs: { href: "/logoff" } }, [
                i(".fa.fa-sign-out", { attrs: { "aria-hidden": "true" } }),
                span(".log-button", {}, "  Выйти")
            ])
        ];
    });
}

/**
 * Maps guest state to view
 * @param stream$ Stream of guest state
 */
export function guest_view(stream$: Stream<guest>) {
    return stream$
    .map((state) => {
        return [
            div(".guest-status", { }, span(".user-name", {}, "Гость")),
            a(".user-login", { attrs: { href: "/login" } }, [
                i(".fa.fa-sign-in", { attrs: { "aria-hidden": "true" } }),
                span(".log-button", {}, "  Войти")
            ])
        ];
    });
}

/**
 * Merges user and guest views
 * @param user_view$ Stream of user views
 * @param guest_view$ Stream of guest views
 */
export function merge_views(user_view$: Stream<VNode[]>, guest_view$: Stream<VNode[]>) {
    return Stream.merge(user_view$, guest_view$);
}

/**
 * Comoses views for both states
 * @param stream$ Stream of views for user stat or guest
 */
export function view(stream$: Stream<VNode[]>) {
    return stream$
    .map((view) => {
        return div("#login-panel", {}, view);
    });
}