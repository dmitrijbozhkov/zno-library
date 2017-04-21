import { div } from "@cycle/dom";
import { Stream } from "xstream";
export function navbar_view(viewSource: Stream<any>) {
    return viewSource.map((d) => {
        return div("#navbar", {}, "stuff");
    });
}