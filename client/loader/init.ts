import "./styles/styles";
import { run } from "@cycle/run";
import { makeDOMDriver, DOMSource, p } from "@cycle/dom";
import { makeMessagingDriver, MessageBroker, PortTarget, TargetRoute, ChooseType, IAttachMessage, MessagingTypes, MessagingCategories, IBrokerMessage } from "messaging-driver";
import { Stream } from "xstream";

interface MainSources {
    DOM: DOMSource;
    worker: ChooseType;
}

const SetupMessage: IAttachMessage = {
    envelope: {
        type: MessagingTypes[1],
        category: MessagingCategories[4],
        name: "Startup"
    },
    data: null,
    target: new PortTarget(new Worker("worker/worker.js") as any, new TargetRoute())
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
    let responses$ = Stream.from(source.worker.Messages("response").Data());
    return {
        DOM: responses$.map((message: IBrokerMessage) => {
            return p(message.data);
        }).startWith(p("Nothing now...")),
        worker: passGreeting$.startWith(SetupMessage)
    };
}

const drivers = {
    DOM: makeDOMDriver("#app"),
    worker: makeMessagingDriver(new MessageBroker())
};
run(main, drivers as any);