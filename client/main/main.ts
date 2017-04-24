import { DOMSource, p, div, a, VNode } from "@cycle/dom";
import { PortTarget, TargetRoute, ChooseType, IAttachMessage, MessagingTypes, MessagingCategories, IBrokerMessage } from "messaging-driver";
import { Stream, MemoryStream } from "xstream";
import { HistoryState } from "./history_types";
import { navbar_component, INavbarIntent } from "../navbar-component/init";
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
 * Views from components
 */
interface ComponentViews {
    navbar$: Stream<VNode>;
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
    // let responses$ = Stream.from(source.worker.Messages("response").Data()).startWith("Nothing now").addListener({next: (m) => {console.log(m); }});
    let isolatedNavbar = isolate(navbar_component);
    let views = {
        navbar$: isolatedNavbar({DOM: source.DOM}).DOM
    };
    return {
        DOM: main_view(views),
        worker: passGreeting$.startWith(SetupMessage)
    };
}

/**
 * Combines all views
 * @param views Collection of views
 */
export function main_view(views: ComponentViews) {
    return Stream
    .combine(views.navbar$)
    .map((views) => {
        return div("#global-wrapper", [
            views[0]
        ]);
    });
}

/**
 * Prevents default behavior of event
 * @param actions$ Stream of UI events
 */
export function prevent_default(actions$: Stream<Event>) {
    return actions$
    .map((event) => {
        event.preventDefault();
        return event;
    });
}