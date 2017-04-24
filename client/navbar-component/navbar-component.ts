import { DOMSource } from "@cycle/dom";
import { Stream } from "xstream";
import { navbar_view } from "./navbar-view";
import { prevent_default } from "../main/main";

/**
 * Source for navbar_component
 */
export interface INavbarIntent {
    DOM: DOMSource;
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
    let toggleNavbar$ = intent.toggleClicks$.compose(navpanel_button_handle);
    let closeNavbar$ = intent.toggleButton$.compose(navbar_button_handle);
    let panelState$ = navbar_state(toggleNavbar$, closeNavbar$);
    return {
        DOM: navbar_view(panelState$)
    };
}

/**
 * Returns sink for navbar_comonent
 * @param dom Navbar clicks
 */
export function navbar_intent(dom: DOMSource) {
    let toggleClicks$ = dom.select("#nav-toggle").events("click").compose(prevent_default);
    let toggleButton$ = dom.select(".nav-button").events("click").compose(prevent_default);
    return {
        toggleClicks$: toggleClicks$,
        toggleButton$: toggleButton$
    };
}

/**
 * Toggles state of navbar
 * @param stream$ Stream of clics on element with id nav-toggle
 */
export function navpanel_button_handle(stream$: Stream<Event>) {
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
 * Maps clicks to nav-close string
 * @param stream$ Stream of clicks on elements with class nav-button
 */
export function navbar_button_handle(stream$: Stream<Event>) {
    return stream$
    .mapTo(PanelStates[1]);
}

/**
 * Merges two event strems for navigation panel
 * @param toggle$ Stream of toggle events
 * @param button$ Stream of close events
 */
export function navbar_state(toggle$: Stream<string>, button$: Stream<string>) {
    return Stream.merge(toggle$, button$);
}