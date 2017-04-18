import "./styles/styles";
import { run } from "@cycle/run";
import { makeDOMDriver, DOMSource, p, div, a } from "@cycle/dom";
import { makeMessagingDriver, MessageBroker, PortTarget, TargetRoute, ChooseType, IAttachMessage, MessagingTypes, MessagingCategories, IBrokerMessage } from "messaging-driver";
import { Stream, MemoryStream } from "xstream";
import { makeHistoryDriver, captureClicks } from "@cycle/history";
import { HistoryState } from "./history_types";

interface MainSources {
    DOM: DOMSource;
    worker: ChooseType;
    history: MemoryStream<any>;
}

const SetupMessage: IAttachMessage = {
    envelope: {
        type: MessagingTypes[1],
        category: MessagingCategories[4],
        name: "Startup"
    },
    data: null,
    target: new PortTarget(new Worker("/static/worker.js") as any, new TargetRoute())
};

const GreetingMessage: IBrokerMessage = {
    envelope: {
        type: MessagingTypes[0],
        category: MessagingCategories[0],
        name: "greeting"
    },
    data: "Hello, "
};

function main(source: MainSources) {
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
try {
    const drivers = {
        DOM: makeDOMDriver("#app"),
        worker: makeMessagingDriver(new MessageBroker()),
        history: captureClicks(makeHistoryDriver())
    };
    run(main, drivers as any);
} catch (e) {
    console.log(e);
}