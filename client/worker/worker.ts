import { makeMessagingDriver, MessageBroker, ChooseType, PortTarget, TargetRoute, IAttachMessage, MessagingTypes, MessagingCategories, IBrokerMessage } from "messaging-driver";
import { Stream } from "xstream";
import { HTTPSource } from "@cycle/http";
import { IParsed } from "../markdown-driver/makeMarkdownDriver";

/**
 * Sources for worker
 */
export interface WorkerSources {
    HTTP: HTTPSource;
    worker: ChooseType;
    markdown: Stream<IParsed>;
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

export function main(source: WorkerSources) {
    let responseStream$ = Stream.from(source.worker.Messages("greeting").Data()).map((message: IBrokerMessage) => {
        message.envelope.name = "response";
        message.data += "worker";
        return message;
    });
    return {
        worker: responseStream$.startWith(SetupMessage)
    };
}