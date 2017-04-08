import * as PouchDB from "pouchdb";
import { ResponseProducer, responseConstructor, IDatabaseResponse } from "./makePouchDbDriver";
import { Stream } from "xstream";
import { adapt } from "@cycle/run/lib/adapt";

export class QueryDatabase {
    private producer: ResponseProducer;
    constructor(producer: ResponseProducer) {
        this.producer = producer;
    }
    /**
     * Creates stream of database events
     * @param event Event name
     */
    public Event(event: string) {
        PouchDB.on(event as any, (e) => {
            this.producer.trigger(responseConstructor("any", "event", false, e as any));
        });
        let stream = Stream.create(this.producer)
        .filter((response: IDatabaseResponse) => {
            return response.command === "event";
        });
        return adapt(stream);
    }
    /**
     * Selects responses from database
     */
    public Database(database: string) {
        let stream = Stream.create(this.producer)
        .filter((response: IDatabaseResponse) => {
            return response.database === database;
        });
        return new QueryResponse(stream);
    }
}

export class QueryResponse {
    private stream: Stream<IDatabaseResponse>;
    constructor(stream: Stream<IDatabaseResponse>) {
        this.stream = stream;
    }
    /**
     * Filters error responses
     * @param err Is response error
     */
    public IsErr(err: boolean) {
        return new QueryResponse(this.stream.filter((response: IDatabaseResponse) => {
            return response.isErr === err;
        }));
    }
    /**
     * Filters by command type
     * @param command Command type
     */
    public Command(command: string) {
        return new QueryResponse(this.stream.filter((response: IDatabaseResponse) => {
            return response.command === command;
        }));
    }
    /**
     * Returns stream of responses
     */
    public Response() {
        return adapt(this.stream);
    }
}