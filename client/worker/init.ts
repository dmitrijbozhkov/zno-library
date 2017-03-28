import { run } from "@cycle/run";
import { makeHTTPDriver, HTTPSource } from "@cycle/http";
import { makeMessagingDriver, MessageBroker, ChooseType, PortTarget, TargetRoute, IAttachMessage, MessagingTypes, MessagingCategories, IBrokerMessage } from "messaging-driver";
import { Stream } from "xstream";

interface WorkerSources {
    HTTP: HTTPSource;
    worker: ChooseType;
}

const SetupMessage: IAttachMessage = {
    envelope: {
        type: MessagingTypes[1],
        category: MessagingCategories[4],
        name: "Startup"
    },
    data: null,
    target: new PortTarget(self as any, new TargetRoute())
};

function main(source: WorkerSources) {
    let responseStream$ = Stream.from(source.worker.Messages("greeting").Data()).map((message: IBrokerMessage) => {
        message.envelope.name = "response";
        message.data += "worker";
        return message;
    });
    return {
        worker: responseStream$.startWith(SetupMessage)
    };
}

const drivers = {
    HTTP: makeHTTPDriver(),
    worker: makeMessagingDriver(new MessageBroker())
};

run(main, drivers);