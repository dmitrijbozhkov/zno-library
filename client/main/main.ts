import { DOMSource, p, div, a, VNode, span } from "@cycle/dom";
import { PortTarget, TargetRoute, ChooseType, IAttachMessage, MessagingTypes, MessagingCategories, IBrokerMessage } from "messaging-driver";
import { Stream, MemoryStream } from "xstream";
import { RouterSource } from "cyclic-router/lib/RouterSource";
import { QueryDatabase } from "../pouchdb-driver/querySink";
import isolate from "@cycle/isolate";

/**
 * Sources for global application function
 */
export interface IMainSources {
    DOM: DOMSource;
    worker: ChooseType;
    router: RouterSource;
    database: QueryDatabase;
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
        name: "parse"
    },
    data: ""
};

let item = a(".menu-item", { attrs: { href: "#" } }, span(".item-content", "This is button"));

/**
 * Creates application
 * @param source Sources for the application
 */
export function main(source: IMainSources) {
    let passGreeting$ = Stream.of(GreetingMessage);
    // let menuStub$ = Stream.of<[VNode]>([item, item]);
    //  let menuStream$ = Stream.of({});
    // let accountSink = account_component({ database: source.database, worker: source.worker, tokenRequest$: Stream.never(), infoRequest$: Stream.never(), rolesRequest$: Stream.never() });
    // let isolatedNavbar = isolate(navbar_component);
    // let navbarSink = isolatedNavbar({DOM: source.DOM, loginState$: accountSink.panelState$, loaderState$: Stream.never(), notify$: Stream.never()} as any);
    return {
        DOM: Stream.of(div("hello all!")).compose(main_view),
        worker: Stream.create().startWith(SetupMessage),
        database: Stream.create()
    };
}

/**
 * Combines all views
 * @param views Collection of views
 */
export function main_view(views: Stream<VNode>) {
    return views
    .map((view) => {
        return div("#global-wrapper", [
            view
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