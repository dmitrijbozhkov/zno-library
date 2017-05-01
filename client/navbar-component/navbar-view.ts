import { div, VNode, a, span, i } from "@cycle/dom";
import { Stream } from "xstream";
import { PanelStates } from "./navbar-component";

/**
 * Maps panel state to panel view
 * @param panelState Stream of states for panel
 */
export function navbar_view(panelState$: Stream<string>, login_view$: Stream<VNode>, notify_view$: Stream<VNode>) {
    let panelChanges$ = panelState$.drop(1).startWith(PanelStates[1]);
    let shadow$ = panelChanges$.compose(navbar_shadow);
    let buttons$ = panelChanges$.compose(navbar_buttons);
    let stat_login$ = combine_state_login(panelChanges$, login_view$);
    let panel$ = stat_login$.compose(navbar_panel);
    let composedViews$ = navbar_compose(panel$, buttons$, shadow$, notify_view$);
    return composedViews$.compose(navbar_global);
}

/**
 * Maps panel sates to navbar-shadow view
 * @param panelState Stream of states of navigation panel
 */
export function navbar_shadow(panelState: Stream<string>) {
    return panelState
    .map((state: string) => {
        return div("#navbar-shadow", { attrs: { "data-state": state } });
    });
}

/**
 * Maps panel states to navbar-buttons view
 * @param panelState Stream of states of navigation panel
 */
export function navbar_buttons(panelState: Stream<string>) {
    return panelState
    .map((state: string) => {
        return div("#navbar-buttons", { attrs: { "data-state": state } }, [
                div(".buttons-wrapper", {}, [
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/" } }, [ i(".fa.fa-home", { attrs: { "aria-hidden": "true" } }), "  Домой" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/search" } }, [ i(".fa.fa-search", { attrs: { "aria-hidden": "true" } }), "  Поиск" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/courses" } }, [ i(".fa.fa-book", { attrs: { "aria-hidden": "true" } }), "  Курсы" ])),
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/user" } }, [ i(".fa.fa-user", { attrs: { "aria-hidden": "true" } }), "  Пользователь" ]))
                ])
            ]);
    });
}

/**
 * Maps panel states to navbar-panel view
 * @param panelState Stream of states of navigation panel
 */
export function navbar_panel(panelState: Stream<[string, VNode]>) {
    return panelState
    .map((input) => {
        return div("#navbar-panel", {}, [
            div(".toggler-wrapper", {}, [
                a("#nav-toggle", { attrs: { "data-state": input[0], href: "#" } }, [
                    span(".toggle-content", [
                        i(".fa.fa-chevron-down", { attrs: { "aria-hidden": "true", "data-state": input[0] } }),
                        "  Metodichka"
                    ])
                ])
            ]),
            input[1]
        ]);
    });
}

/**
 * Combines panel state and login view
 * @param state$ Stream of panel states
 * @param login_view$ Stream of login views
 */
export function combine_state_login(state$: Stream<string>, login_view$: Stream<VNode>) {
    return Stream.combine(state$, login_view$);
}

/**
 * Returns navbar view
 * @param views$ Composed views
 */
export function navbar_global(views$: Stream<[VNode, VNode, VNode, VNode]>) {
    return views$.map((views) => {
        return div("#navbar-wrapper", [
            views[0],
            views[1],
            views[2],
            views[3]
        ]);
    });
}

/**
 * Composes all views
 * @param shadow$ navbar_shadow view
 * @param buttons$ navbar_buttons view
 * @param panel$ navbar_panel view
 */
export function navbar_compose(panel$: Stream<VNode>, buttons$: Stream<VNode>, shadow$: Stream<VNode>, loader$: Stream<VNode>) {
    return Stream.combine(panel$, buttons$, shadow$, loader$);
}