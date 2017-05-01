import { filter_user_state, loginStates, user, guest, user_view, guest_view, merge_views, view, navbar_login_view, navbar_login_component } from "../../../../client/navbar-component/login-component/navbar-login-component";
import { a, span, div, i } from "@cycle/dom";
import { Stream } from "xstream";
import * as assert from "assert";

describe("tests for panel_login_component", () => {
    it("filter_user_state should take stream of loginStates and if expected_state is true return loginStates with first item true", () => {
        let loginStates$ = Stream.of<user>([true, "Ivan", "Ivanovich"]);
        let filtered_statuses$ = filter_user_state(loginStates$, true);
        filtered_statuses$.addListener({
            next: (state) => {
                assert.strictEqual(state[0], true);
            }
        });
    });
    it("filter_user_state should take stream of loginStates and if expected_state is false return loginStates with first item false", () => {
        let loginStates$ = Stream.of<guest>([true]);
        let filtered_statuses$ = filter_user_state(loginStates$, false);
        filtered_statuses$.addListener({
            next: (state) => {
                assert.strictEqual(state[0], false);
            }
        });
    });
    it("user_view should return Stream that maps user state to array of VNode", () => {
        let expected = [
            a(".user-button", { attrs: { href: "/user" } }, [
                i(".fa.fa-user", { attrs: { "aria-hidden": "true" } }),
                span(".user-name", {}, "  Иван Иванович")
            ]),
            a(".user-logoff", { attrs: { href: "/logoff" } }, [
                i(".fa.fa-sign-out", { attrs: { "aria-hidden": "true" } }),
                span(".log-button", {}, "  Выйти")
            ])
        ];
        let user_state$ = Stream.of<user>([true, "Иван", "Иванович"]);
        user_state$
        .compose(user_view)
        .addListener({
            next: (view) => {
                assert.deepStrictEqual(view, expected);
            }
        });
    });
    it("guest_view should return Stream that maps guest state to array of VNode", () => {
        let expected = [
            div(".guest-status", { }, span(".user-name", {}, "Гость")),
            a(".user-login", { attrs: { href: "/login" } }, [
                i(".fa.fa-sign-in", { attrs: { "aria-hidden": "true" } }),
                span(".log-button", {}, "  Войти")
            ])
        ];
        let user_state$ = Stream.of<guest>([true]);
        user_state$
        .compose(guest_view)
        .addListener({
            next: (view) => {
                assert.deepStrictEqual(view, expected);
            }
        });
    });
    it("merge_views should return Stream of merged guest and user views", () => {
        let merge1$ = Stream.of(1);
        let merge2$ = Stream.of(2);
        let message = 1;
        merge_views(merge1$ as any, merge2$ as any)
        .addListener({
            next: (item) => {
                if (message === 2) {
                    assert.deepEqual(item, 2);
                }
                if (message === 1) {
                    assert.deepEqual(item, 1);
                    message += 1;
                }
            }
        });
    });
    it("view should get Stream of VNode arrays and map them into div", () => {
        let expected = div("#login-panel", {}, [1, 2]);
        let arrStream$ = Stream.of<any>([1, 2]);
        arrStream$
        .compose(view)
        .addListener({
            next: (mapped) => {
                assert.deepStrictEqual(mapped, expected);
            }
        });
    });
    it("navbar_login_view should get stream of user and guest states and return view with user view if user is present", () => {
        let users$ = Stream.of<user>([true, "Иван", "Иванович"]);
        let guests$ = Stream.never();
        let expected = div("#login-panel", {}, [
            a(".user-button", { attrs: { href: "/user" } }, [
                i(".fa.fa-user", { attrs: { "aria-hidden": "true" } }),
                span(".user-name", {}, "  Иван Иванович")
            ]),
            a(".user-logoff", { attrs: { href: "/logoff" } }, [
                i(".fa.fa-sign-out", { attrs: { "aria-hidden": "true" } }),
                span(".log-button", {}, "  Выйти")
            ])
        ]);
        let login_view$ = navbar_login_view(users$, guests$);
        login_view$
        .addListener({
            next: (all_view) => {
                assert.deepStrictEqual(all_view, expected);
            }
        });
    });
    it("navbar_login_view should get stream of user and guest states and return view with guest view if guest is present", () => {
        let users$ = Stream.never();
        let guests$ = Stream.of<guest>([false]);
        let expected = div("#login-panel", {}, [
            div(".guest-status", { }, span(".user-name", {}, "Гость")),
            a(".user-login", { attrs: { href: "/login" } }, [
                i(".fa.fa-sign-in", { attrs: { "aria-hidden": "true" } }),
                span(".log-button", {}, "  Войти")
            ])
        ]);
        let login_view$ = navbar_login_view(users$, guests$);
        login_view$
        .addListener({
            next: (all_view) => {
                assert.deepStrictEqual(all_view, expected);
            }
        });
    });
    it("navbar_login_component should get stream of login states and return user view if user state", () => {
        let loginState$ = Stream.of<user>([true, "Иван", "Иванович"]);
        let expected = div("#login-panel", {}, [
            a(".user-button", { attrs: { href: "/user" } }, [
                i(".fa.fa-user", { attrs: { "aria-hidden": "true" } }),
                span(".user-name", {}, "  Иван Иванович")
            ]),
            a(".user-logoff", { attrs: { href: "/logoff" } }, [
                i(".fa.fa-sign-out", { attrs: { "aria-hidden": "true" } }),
                span(".log-button", {}, "  Выйти")
            ])
        ]);
        loginState$
        .compose(navbar_login_component)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
    it("navbar_login_component should get stream of login states and return guest view if guest state", () => {
        let loginState$ = Stream.of<guest>([false]);
        let expected = div("#login-panel", {}, [
            div(".guest-status", { }, span(".user-name", {}, "Гость")),
            a(".user-login", { attrs: { href: "/login" } }, [
                i(".fa.fa-sign-in", { attrs: { "aria-hidden": "true" } }),
                span(".log-button", {}, "  Войти")
            ])
        ]);
        loginState$
        .compose(navbar_login_component)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
});