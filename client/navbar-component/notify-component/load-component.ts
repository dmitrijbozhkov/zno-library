import { loadNotify } from "./notify-component";
import { VNode, div, i, a, span } from "@cycle/dom";

/**
 * Maps load events to its view
 * @param load$ Stream of load events
 */
export function load_component(load$: loadNotify) {
    return load$.startWith([false] as any).compose(load_view);
}

/**
 * Maps loading events to view
 * @param stream$ Stream of loading events
 */
export function load_view(stream$: loadNotify) {
    return stream$
    .map((notify) => {
        return div("#load-wrapper", { attrs: { "data-state": notify[0] ? "load-open" : "load-close" } }, [
            div(".load-content.load-item", {}, notify[1]),
            div(".load-icon.load-item", {}, ),
            a(".load-cancel.load-item", { attrs: { href: "#" } }, [
                i(".fa.fa-times", { attrs: { "aria-hidden": "true" } })
            ])
        ]);
    });
}