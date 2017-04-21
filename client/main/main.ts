import { DOMSource, p, div, a } from "@cycle/dom";
import { PortTarget, TargetRoute, ChooseType, IAttachMessage, MessagingTypes, MessagingCategories, IBrokerMessage } from "messaging-driver";
import { Stream, MemoryStream } from "xstream";
import { HistoryState } from "./history_types";
import { navbar_component, INavbarSource } from "../navbar-component/init";
import isolate from "@cycle/isolate";

/**
 * Sources for global application function
 */
interface MainSources {
    DOM: DOMSource;
    worker: ChooseType;
    history: MemoryStream<any>;
}

/**
 * Setups worker
 */
const SetupMessage: IAttachMessage = {
    envelope: {
        type: MessagingTypes[1],
        category: MessagingCategories[4],
        name: "Startup"
    },
    data: null,
    target: new PortTarget(new Worker("/static/worker.js") as any, new TargetRoute())
};

/**
 * Checks if worker is working
 */
const GreetingMessage: IBrokerMessage = {
    envelope: {
        type: MessagingTypes[0],
        category: MessagingCategories[0],
        name: "greeting"
    },
    data: "Hello, "
};

/**
 * Creates application
 * @param source Sources for the application
 */
export function main(source: MainSources) {
    let passGreeting$ = Stream.of(GreetingMessage);
    let responses$ = Stream.from(source.worker.Messages("response").Data()).startWith("Nothing now");
    let view$ = Stream.combine(responses$, source.history).drop(1);
    return {
        DOM: view$.map((message: [IBrokerMessage, HistoryState]) => {
            console.log(message[1]);
            return div([
                p(message[0].data),
                p(message[1].pathname),
                a("#kek", { attrs: { href: "/kek" }, }, "Click me 1"),
                a("#lel", { attrs: { href: "/lel" }, }, "Click me 2")
            ]);
        }),
        worker: passGreeting$.startWith(SetupMessage)
    };
}

/**
 * Returns sink for navbar_comonent
 * @param dom Navbar clicks
 */
export function navbar_intent(dom: DOMSource) {
    let toggleClicks$ = dom.select("#nav-toggle").events("click");
    let toggleButton$ = dom.select(".nav-button").events("click");
    return {
        toggleClicks$: toggleClicks$,
        toggleButton$: toggleButton$
    };
}