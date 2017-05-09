import { run } from "@cycle/run";
import { makeMessagingDriver, MessageBroker } from "messaging-driver";
import { makeMarkdownDriver } from "../markdown-driver/makeMarkdownDriver";
import { makeHTTPDriver } from "@cycle/http";
import { main } from "./worker";

const drivers = {
    HTTP: makeHTTPDriver(),
    worker: makeMessagingDriver(new MessageBroker()),
    markdown: makeMarkdownDriver()
};

run(main, drivers);