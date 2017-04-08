import { adapt } from "@cycle/run/lib/adapt";
import { FantasyObservable, FantasyObserver } from "@cycle/run";
import { Producer, Listener, Stream } from "xstream";
import * as PouchDB from "pouchdb";
import commandHandlers from "./commandHandlers";
import transactionHandlers from "./transactionHandlers";
import { QueryDatabase } from "./querySink";

/**
 * Database transactions
 */
export enum TransactionCommand {
    get,
    put,
    post,
    remove,
    bulkDocs,
    bulkGet,
    allDocs,
    putAttachment,
    removeAttachment,
    getAttachment,
}

/**
 * Database commands
 */
export enum DatabaseCommand {
    create,
    destroy,
    compact,
    info,
    close,
    debug
}

/**
 * Database document fields
 */
export interface Document {
    _id?: string;
    _rev?: string;
};

/**
 * Commands for driver
 */
export interface ICommand {
    database: string;
    command: string;
    options?: { [option: string]: any };
};

/**
 * Response from database
 */
export interface IDatabaseResponse {
    database: string;
    command: string;
    isErr: boolean;
    response: object;
}

/**
 * Transactions for database
 */
export interface ITransaction {
    database: string;
    type: string;
    document: Document;
    options?: { [option: string]: any };
}

/**
 * Source messages for PouchDB driver
 */
export type DBSource = ICommand | ITransaction;

/**
 * Callback for database operations
 */
export type ResponseCallback = (response: IDatabaseResponse) => void;

/**
 * Creates driver for PouchDB
 * @param databases List of databases
 */
export function makePouchDBDriver() {
    let callbacks = new ResponseProducer();
    let handler = route(commandHandlers, transactionHandlers, callbacks);
    return (commands: FantasyObservable, name?: string) => {
        commands.subscribe({
            next: (command: DBSource) => {
                if ((command as ICommand).command) {
                    handler.routeCommands(command as ICommand);
                } else if ((command as ITransaction).type) {
                    handler.routeTransactions(command as ITransaction);
                } else {
                    throw new Error("No such command");
                }
            },
            error: () => {},
            complete: () => {}
        });
        return new QueryDatabase(callbacks);
    };
}

/**
 * Routes messages for appropriate handlers
 * @param commandHandlers Functions that manage databases
 * @param transactionHandlers Functions that handle transactions
 * @param producer Sink for database responses
 */
export function route(commandHandlers: any, transactionHandlers: any, producer: ResponseProducer) {
    let databases = {};
    let callback: ResponseCallback = (response: IDatabaseResponse) => {
        producer.trigger(response);
    };
    function routeCommands(command: ICommand): any {
        if (!databases[command.database] && command.command !== DatabaseCommand[0]) {
            throw new Error("No such database");
        }
        switch (command.command) {
            case DatabaseCommand[0]:
                databases = commandHandlers.createHanlder(command, databases);
                break;
            case DatabaseCommand[1]:
                databases = commandHandlers.destroyHandler(command, databases, callback);
                break;
            case DatabaseCommand[2]:
                commandHandlers.compactHandler(command, databases, callback);
                break;
            case DatabaseCommand[3]:
                commandHandlers.infoHandler(command, databases, callback);
                break;
            case DatabaseCommand[4]:
                commandHandlers.closeHandler(command, databases, callback);
                break;
            case DatabaseCommand[5]:
                commandHandlers.debugHandler(command);
                break;
            default:
                throw new Error("No such database command");
        }
    }
    function checkKey(type: string) {
        return type === TransactionCommand[0] || type === TransactionCommand[1] || type === TransactionCommand[2] || type === TransactionCommand[3] || type === TransactionCommand[4];
    }
    function checkSimple(type: string) {
        return type === TransactionCommand[5] || type === TransactionCommand[6];
    }
    function routeTransactions(transaction: ITransaction): any {
        if (!databases[transaction.database]) {
            throw new Error("No such database");
        }
        if (checkKey(transaction.type)) {
            transactionHandlers.keyHandler(transaction, databases, callback);
        } else if (checkSimple(transaction.type)) {
            transactionHandlers.simpleHandler(transaction, databases, callback);
        } else if (transaction.type === TransactionCommand[7]) {
            transactionHandlers.putAttachmentHandler(transaction, databases, callback);
        } else if (transaction.type === TransactionCommand[8]) {
            transactionHandlers.removeAttachmentHandler(transaction, databases, callback);
        } else if (transaction.type === TransactionCommand[9]) {
            transactionHandlers.getAttachmentHandler(transaction, databases, callback);
        } else {
            throw new Error("No such database transaction");
        }
    }
    return {
        routeCommands: routeCommands,
        routeTransactions: routeTransactions
    };
}

/**
 * Creates IDatabaseResponse object
 */
export function responseConstructor(database: string, command: string, isErr: boolean, response: object): IDatabaseResponse {
    return {
        database: database,
        command: command,
        isErr: isErr,
        response: response
    };
}

export class ResponseProducer implements Producer<IDatabaseResponse> {
    private listener: Listener<IDatabaseResponse>;
    /**
     * Starts listening for html
     * @param listener Listener which listens for parsed HTML
     */
    public start(listener: Listener<IDatabaseResponse>) {
        this.listener = listener;
    }
    /**
     * Passes new value to listener
     */
    public trigger(response: IDatabaseResponse) {
        this.listener.next(response);
    }
    public stop() {}
}