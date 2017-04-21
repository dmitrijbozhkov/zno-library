import { DOMSource } from "@cycle/dom";
export interface INavbarSource {
    DOM: DOMSource;
}
export function navbar_component(source: INavbarSource) {
    let navbarClicks$ = source.DOM.select(".navbar").events("click");
}