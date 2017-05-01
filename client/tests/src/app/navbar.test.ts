import * as assert from "assert";
import { button_handle, navbar_state, PanelStates, navbar_intent, navbar_component } from "../../../../client/navbar-component/navbar-component";
import { navbar_shadow, navbar_buttons, navbar_panel, navbar_global, navbar_compose, navbar_view } from "../../../../client/navbar-component/navbar-view";
import { Stream } from "xstream";
import { div, a, i, span } from "@cycle/dom";
import { createDomSinkMock } from "./utils.test";

describe("tests for navbar_component", () => {
    it("navbar_intent should take DOMSource and return toggleClicks$ stream of clicks on element with #nav-toggle", () => {
        let domSinkMock = createDomSinkMock("", "", "", false);
        let intent = navbar_intent(domSinkMock as any);
        assert.deepEqual((intent.toggleClicks$ as any).selector, "#nav-toggle");
        assert.deepEqual((intent.toggleClicks$ as any).event, "click");
    });
    it("navbar_intent should take DOMSource and return toggleButton$ stream of clicks on element with .nav-button", () => {
        let domSinkMock = createDomSinkMock("", "", "", false);
        let intent = navbar_intent(domSinkMock as any);
        assert.deepEqual((intent.toggleButton$ as any).selector, ".nav-button");
        assert.deepEqual((intent.toggleButton$ as any).event, "click");
    });
    it("button_handle should return a stream that starts with 'nav-close'", () => {
        let clicks$ = Stream.never();
        clicks$
        .compose(button_handle)
        .addListener({
            next: (panelState: string) => {
                assert.deepEqual(panelState, PanelStates[1]);
            }
        });
    });
    it("button_handle should return a stream that after event returns 'nav-open'", () => {
        let clicks$ = Stream.of({});
        clicks$
        .compose(button_handle)
        .drop(1)
        .addListener({
            next: (panelState: string) => {
                assert.deepEqual(panelState, PanelStates[0]);
            }
        });
    });
    it("button_handle should return a stream that after two events returns 'nav-close'", () => {
        let clicks$ = Stream.of({}, {});
        clicks$
        .compose(button_handle)
        .drop(2)
        .addListener({
            next: (panelState: string) => {
                assert.deepEqual(panelState, PanelStates[1]);
            }
        });
    });
    it("navbar_state should merge two streams of navbar states", () => {
        let toggler$ = Stream.of(PanelStates[0]);
        let button$ = Stream.of(PanelStates[1]);
        let message = 1;
        navbar_state(toggler$ as any, button$ as any)
        .addListener({
            next: (panelState: any) => {
                if (message === 2) {
                    assert.deepEqual(panelState, PanelStates[1]);
                }
                if (message === 1) {
                    assert.deepEqual(panelState, PanelStates[0]);
                    message += 1;
                }
            }
        });
    });
    it("navbar_shadow should map panelState to div with id navbar-shadow and attribute data-state with panelState", () => {
        let state$ = Stream.of(PanelStates[1]);
        let expected = div("#navbar-shadow", { attrs: { "data-state": PanelStates[1] } });
        state$
        .compose(navbar_shadow)
        .addListener({
            next: (view) => {
                assert.deepEqual(view, expected);
            }
        });
    });
    it("navbar_buttons should map panelState to view", () => {
        let expected = div("#navbar-buttons", { attrs: { "data-state": PanelStates[0] } }, [
                div(".buttons-wrapper", {}, [
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/" } }, [ i(".fa.fa-home", { attrs: { "aria-hidden": "true" } }), "  Домой" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/search" } }, [ i(".fa.fa-search", { attrs: { "aria-hidden": "true" } }), "  Поиск" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/courses" } }, [ i(".fa.fa-book", { attrs: { "aria-hidden": "true" } }), "  Курсы" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/user" } }, [ i(".fa.fa-user", { attrs: { "aria-hidden": "true" } }), "  Пользователь" ]))
                ])
            ]);
        let stateStream$ = Stream.of(PanelStates[0]);
        stateStream$
        .compose(navbar_buttons)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
    it("navbar_panel should map panelState and login view to view", () => {
        let expected = div("#navbar-panel", {}, [
            div(".toggler-wrapper", {}, [
                a("#nav-toggle", { attrs: { "data-state": PanelStates[0], href: "#" } }, [
                    span(".toggle-content", [
                        i(".fa.fa-chevron-down", { attrs: { "aria-hidden": "true", "data-state": PanelStates[0] } }),
                        "  Metodichka"
                    ])
                ])
            ]),
            div(".view")
        ]);
        let stateStream$ = Stream.of([PanelStates[0], div(".view")]);
        stateStream$
        .compose(navbar_panel)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
    it("navbar_global should map navbar_buttons, navbar_panel and navbar_shadow to one view", () => {
        let expected = div("#navbar-wrapper", [
            0,
            1,
            2,
            3
        ]);
        let view_stream$ = Stream.of<any>([0, 1, 2, 3]);
        view_stream$
        .compose(navbar_global)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
    it("navbar_compose should start with nav-close state view", () => {
        let expected = [1, 2, 3, 4];
        let stream1$ = Stream.of(1);
        let stream2$ = Stream.of(2);
        let stream3$ = Stream.of(3);
        let stream4$ = Stream.of(4);
        navbar_compose(stream1$ as any, stream2$ as any, stream3$ as any, stream4$ as any)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
    it("navbar_view should get panelState, drop first event and return view with state equal to nav-close", () => {
        let panel_expected = div("#navbar-panel", {}, [
            div(".toggler-wrapper", {}, [
                a("#nav-toggle", { attrs: { "data-state": PanelStates[1], href: "#" } }, [
                    span(".toggle-content", [
                        i(".fa.fa-chevron-down", { attrs: { "aria-hidden": "true", "data-state": PanelStates[1] } }),
                        "  Metodichka"
                    ])
                ])
            ]),
            div(".view")
        ]);
        let buttons_expected = div("#navbar-buttons", { attrs: { "data-state": PanelStates[1] } }, [
                div(".buttons-wrapper", {}, [
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/" } }, [ i(".fa.fa-home", { attrs: { "aria-hidden": "true" } }), "  Домой" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/search" } }, [ i(".fa.fa-search", { attrs: { "aria-hidden": "true" } }), "  Поиск" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/courses" } }, [ i(".fa.fa-book", { attrs: { "aria-hidden": "true" } }), "  Курсы" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/user" } }, [ i(".fa.fa-user", { attrs: { "aria-hidden": "true" } }), "  Пользователь" ]))
                ])
        ]);
        let shadow_expected = div("#navbar-shadow", { attrs: { "data-state": PanelStates[1] } });
        let notify_expected = div("#stuff");
        let expected = div("#navbar-wrapper", [
            panel_expected,
            buttons_expected,
            shadow_expected,
            notify_expected
        ]);
        let panelState$ = Stream.of(PanelStates[0]);
        let login_view$ = Stream.of(div(".view"));
        let notify_view$ = Stream.of(notify_expected);
        navbar_view(panelState$, login_view$, notify_view$)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
    it("navbar_view should get panelState, drop first event and return view, on second nav-open", () => {
        let panel_expected = div("#navbar-panel", {}, [
            div(".toggler-wrapper", {}, [
                a("#nav-toggle", { attrs: { "data-state": PanelStates[0], href: "#" } }, [
                    span(".toggle-content", [
                        i(".fa.fa-chevron-down", { attrs: { "aria-hidden": "true", "data-state": PanelStates[0] } }),
                        "  Metodichka"
                    ])
                ])
            ]),
            div(".view")
        ]);
        let buttons_expected = div("#navbar-buttons", { attrs: { "data-state": PanelStates[0] } }, [
                div(".buttons-wrapper", {}, [
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/" } }, [ i(".fa.fa-home", { attrs: { "aria-hidden": "true" } }), "  Домой" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/search" } }, [ i(".fa.fa-search", { attrs: { "aria-hidden": "true" } }), "  Поиск" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/courses" } }, [ i(".fa.fa-book", { attrs: { "aria-hidden": "true" } }), "  Курсы" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/user" } }, [ i(".fa.fa-user", { attrs: { "aria-hidden": "true" } }), "  Пользователь" ]))
                ])
        ]);
        let shadow_expected = div("#navbar-shadow", { attrs: { "data-state": PanelStates[0] } });
        let notify_expected = div("#stuff");
        let expected = div("#navbar-wrapper", [
            panel_expected,
            buttons_expected,
            shadow_expected,
            notify_expected
        ]);
        let panelState$ = Stream.of(PanelStates[0], PanelStates[0]);
        let login_view$ = Stream.of(div(".view"));
        let notify_view$ = Stream.of(notify_expected);
        navbar_view(panelState$, login_view$, notify_view$)
        .drop(1)
        .addListener({
            next: (actual) => {
                assert.deepStrictEqual(actual, expected);
            }
        });
    });
});