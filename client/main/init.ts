import { run } from "@cycle/run";
import { main } from "./main";
import { makeDOMDriver } from "@cycle/dom";
import { makeMessagingDriver, MessageBroker } from "messaging-driver";
import { makeRouterDriver } from "cyclic-router";
import createHistory from "history/createBrowserHistory";
import switchPath from "switch-path";
import { makePouchDBDriver } from "../pouchdb-driver/makePouchDbDriver";

const drivers = {
    DOM: makeDOMDriver("#app"),
    worker: makeMessagingDriver(new MessageBroker()),
    router: makeRouterDriver(createHistory(), switchPath),
    database: makePouchDBDriver()
};
run(main, drivers as any);