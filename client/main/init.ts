import { run } from "@cycle/run";
import { main } from "./main";
import { makeDOMDriver } from "@cycle/dom";
import { makeMessagingDriver, MessageBroker } from "messaging-driver";
import { makeHistoryDriver, captureClicks } from "@cycle/history";
import "./styles/styles";

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