import { div, VNode, a, span, i } from "@cycle/dom";
import { Stream } from "xstream";
import { PanelStates } from "./navbar-component";

/**
 * Maps panel state to panel view
 * @param panelState Stream of states for panel
 */
export function navbar_view(panelState: Stream<string>) {
    let panelChanges$ = panelState.drop(1).startWith(PanelStates[1]);
    let shadow$ = panelChanges$.compose(navbar_shadow);
    let buttons$ = panelChanges$.compose(navbar_buttons);
    let panel$ = panelChanges$.compose(navbar_panel);
    let composedViews$ = navbar_compose(panel$, buttons$, shadow$);
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
                    div(".button-wrapper", {}, a(".nav-button", { attrs: { href: "/search" } }, [ i(".fa.fa-search", { attrs: { "aria-hidden": "true" } }), "Search" ]))
                ])
            ]);
    });
}

/**
 * Maps panel states to navbar-panel view
 * @param panelState Stream of states of navigation panel
 */
export function navbar_panel(panelState: Stream<string>) {
    return panelState
    .map((state: string) => {
        return div("#navbar-panel", {}, [
            div(".toggler-wrapper", {}, [
                a("#nav-toggle", { attrs: { "data-state": state, href: "#" } }, [
                    span(".toggle-content", [
                        i(".fa.fa-chevron-down", { attrs: { "aria-hidden": "true", "data-state": state } }),
                        "Metodichka"
                    ])
                ])
            ])
        ]);
    });
}

/**
 * Returns navbar view
 * @param views$ Composed views
 */
export function navbar_global(views$: Stream<[VNode, VNode, VNode]>) {
    return views$.map((views) => {
        return div("#navbar-wrapper", [
            views[0],
            views[1],
            views[2]
        ]);
    });
}

/**
 * Composes all views
 * @param shadow$ navbar_shadow view
 * @param buttons$ navbar_buttons view
 * @param panel$ navbar_panel view
 */
export function navbar_compose(panel$: Stream<VNode>, buttons$: Stream<VNode>, shadow$: Stream<VNode>) {
    return Stream.combine(panel$, buttons$, shadow$);
}