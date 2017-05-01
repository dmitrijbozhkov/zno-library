import { DOMSource, span } from "@cycle/dom";
import { Stream } from "xstream";
import { navbar_view } from "./navbar-view";
import { prevent_default } from "../main/main";
import { loadNotify , notify_component, INotification } from "./notify-component/init";
import { navbar_login_component, loginStates } from "./login-component/init";
/**
 * Sources for navbar intent
 */
export interface INavbarIntent {
    DOM: DOMSource;
    loginState$: loginStates;
    loaderState$: loadNotify;
    notify$: Stream<INotification>;
}

/**
 * States for navigation panel
 */
export enum PanelStates {
    "nav-open",
    "nav-close"
}

/**
 * Comonent that creates navbar
 * @param source Clicks of navbar buttons
 */
export function navbar_component(source: INavbarIntent) {
    let intent = navbar_intent(source.DOM);
    let panelClick$ = navbar_state(intent.toggleClicks$, intent.toggleButton$);
    let panelState$ = panelClick$.compose(button_handle);
    let navbar_login$ = navbar_login_component(source.loginState$);
    let navbar_notify$ = notify_component(source.loaderState$, source.notify$);
    return {
        DOM: navbar_view(panelState$, navbar_login$, navbar_notify$)
    };
}

/**
 * Returns sink for navbar_comonent
 * @param dom Navbar clicks
 */
export function navbar_intent(dom: DOMSource) {
    let toggleClicks$ = dom.select("#nav-toggle").events("click").compose(prevent_default);
    let toggleButton$ = dom.select(".nav-button").events("click");
    return {
        toggleClicks$: toggleClicks$,
        toggleButton$: toggleButton$
    };
}

/**
 * Toggles state of navbar
 * @param stream$ Stream of clics on element with id nav-toggle
 */
export function button_handle(stream$: Stream<Event>) {
    return stream$
    .fold((acc, click) => {
        if (acc === PanelStates[1]) {
            return PanelStates[0];
        } else if (acc === PanelStates[0]) {
            return PanelStates[1];
        }
     }, PanelStates[1]);
}

/**
 * Merges two event strems for navigation panel
 * @param toggle$ Stream of toggle events
 * @param button$ Stream of close events
 */
export function navbar_state(toggle$: Stream<Event>, button$: Stream<Event>) {
    return Stream.merge(toggle$, button$);
}