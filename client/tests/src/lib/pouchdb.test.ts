import * as assert from "assert";
import { makePouchDBDriver, route, ICommand, ITransaction, DatabaseCommand, TransactionCommand, ResponseCallback, IDatabaseResponse, ResponseProducer, responseConstructor } from "../../../../client/pouchdb-driver/makePouchDbDriver";
import commandHandlers from "../../../../client/pouchdb-driver/commandHandlers";
import transactionHandlers from "../../../../client/pouchdb-driver/transactionHandlers";
import { QueryDatabase } from "../../../../client/pouchdb-driver/querySink";
import * as PouchDB from "pouchdb";
import { Stream } from "xstream";

describe("makePouchDBDriver tests", () => {
    beforeEach(() => {
        new PouchDB("test")
        .destroy();
    });
    it("makePouchDBDriver driver should throw an exception if passed object doesn't have command and type fields", () => {
        let failStream = Stream.never();
        let driver = makePouchDBDriver()(failStream);
        assert.throws(() => {
            failStream.shamefullySendNext({});
        });
    });
    it("makePouchDBDriver driver should throw an exception if ICommand message passed with command destroy and database that isn't created", () => {
        let router = route({}, {}, {} as any);
        let command: ICommand = {
            database: "test",
            command: DatabaseCommand[1],
            options: {},
            category: "command"
        };
        assert.throws(() => {
            router.routeCommands(command);
        });
    });
    it("makePouchDBDriver driver should throw an exception if ITransaction message passed with type get and database that isn't created", () => {
        let router = route({}, {}, {} as any);
        let transaction: ITransaction = {
            database: "test",
            type: TransactionCommand[0],
            document: {},
            options: {},
            category: "command"
        };
        assert.throws(() => {
            router.routeTransactions(transaction);
        });
    });
    it("makePouchDBDriver driver should create new database with name 'test' if ICommand message have database 'test' and command 'create'", () => {
        let inputCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let dummyHandler = {
            createHanlder: function(command, databases) {
                assert.deepEqual(command, inputCommand);
            }
        };
        let router = route(dummyHandler, {}, {} as any);
        router.routeCommands(inputCommand);
    });
    it("makePouchDBDriver driver should route messages with command destroy to destroyHandler and pass response into sink stream producer", () => {
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let inputCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[1],
            options: {},
            category: "command"
        };
        let expected: IDatabaseResponse =  {
            database: "test",
            command: DatabaseCommand[1],
            isErr: false,
            response: { ok: "true" },
            category: "command"
        };
        let producer = new ResponseProducer();
        Stream.create(producer).subscribe({
            next: (actual: IDatabaseResponse) => {
                assert.deepEqual(actual, expected);
            },
            error: () => {},
            complete: () => {}
        });
        let driver = route(commandHandlers, transactionHandlers, producer);
        driver.routeCommands(createCommand);
        driver.routeCommands(inputCommand);
    });
    it("makePouchDBDriver should route commands with command 'close' to closeHandler()", () => {
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let inputCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[4],
            options: {},
            category: "command"
        };
        let expected: IDatabaseResponse =  {
            database: "test",
            command: DatabaseCommand[4],
            isErr: false,
            response: { ok: "true" },
            category: "command"
        };
        let producer = new ResponseProducer();
        Stream.create(producer).subscribe({
            next: (actual: IDatabaseResponse) => {
                assert.deepEqual(actual, expected);
            },
            error: () => {},
            complete: () => {}
        });
        let driver = route(commandHandlers, transactionHandlers, producer);
        driver.routeCommands(createCommand);
        driver.routeCommands(inputCommand);
    });
    it("makePouchDBDriver should route commands with command 'debug' to debugHandler()", () => {
        let debugHandler = {
            debugHandler: function(command: ICommand) {
                assert.ok(command);
            },
            createHanlder: commandHandlers.createHanlder
        };
        let inputCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[5],
            options: {
                debug: "enable",
                target: "*"
            },
            category: "command"
        };
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let router = route(debugHandler, {}, new ResponseProducer());
        router.routeCommands(createCommand);
        router.routeCommands(inputCommand);
    });
    it("makePouchDBDriver should route get, post, remove and bulkDocs to keyHandler()", () => {
        let transactionHandler = {
            keyHandler: function(command: ICommand) {
                assert.ok(command);
            }
        };
        let commandHandler = {
            createHanlder: commandHandlers.createHanlder
        };
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let transactionCommand: ITransaction = {
            database: "test",
            type: TransactionCommand[0],
            document: {},
            options: {},
            category: "command"
        };
        let router = route(commandHandler, transactionHandler, new ResponseProducer());
        router.routeCommands(createCommand);
        router.routeTransactions(transactionCommand);
    });
    it("makePouchDBDriver should route bulkGet and allDocs to simpleHandler", () => {
        let transactionHandler = {
            simpleHandler: function(command: ICommand) {
                assert.ok(command);
            }
        };
        let commandHandler = {
            createHanlder: commandHandlers.createHanlder
        };
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let transactionCommand: ITransaction = {
            database: "test",
            type: TransactionCommand[5],
            document: {},
            options: {},
            category: "command"
        };
        let router = route(commandHandler, transactionHandler, new ResponseProducer());
        router.routeCommands(createCommand);
        router.routeTransactions(transactionCommand);
    });
    it("makePouchDBDriver should route compact to compactHandler()", () => {
        let transactionHandler = {};
        let commandHandler = {
            createHanlder: commandHandlers.createHanlder,
            compactHandler: function(command: ICommand) {
                assert.ok(command);
            }
        };
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let command: ICommand = {
            database: "test",
            command: DatabaseCommand[2],
            options: {},
            category: "command"
        };
        let router = route(commandHandler, transactionHandler, new ResponseProducer());
        router.routeCommands(createCommand);
        router.routeCommands(command);
    });
    it("makePouchDBDriver should route info to infoHandler()", () => {
        let transactionHandler = {};
        let commandHandler = {
            createHanlder: commandHandlers.createHanlder,
            infoHandler: function(command: ICommand) {
                assert.ok(command);
            }
        };
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let command: ICommand = {
            database: "test",
            command: DatabaseCommand[3],
            options: {},
            category: "command"
        };
        let router = route(commandHandler, transactionHandler, new ResponseProducer());
        router.routeCommands(createCommand);
        router.routeCommands(command);
    });
    it("makePouchDBDriver should throw an error if command passed that is not in DatabaseCommand", () => {
        let transactionHandler = {};
        let commandHandler = {
            createHanlder: commandHandlers.createHanlder
        };
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let command: ICommand = {
            database: "test",
            command: "wrong",
            options: {},
            category: "command"
        };
        let router = route(commandHandler, transactionHandler, new ResponseProducer());
        router.routeCommands(createCommand);
        assert.throws(() => {
            router.routeCommands(command);
        });
    });
    it("makePouchDBDriver should route putAttachment to putAttachmentHandler()", () => {
        let transactionHandler = {
            putAttachmentHandler: function(transaction: ITransaction, databases: object, callback: ResponseCallback) {
                assert.ok(transaction);
            }
        };
        let commandHandler = {
            createHanlder: commandHandlers.createHanlder
        };
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let command: ITransaction = {
            database: "test",
            type: TransactionCommand[7],
            document: {},
            options: {},
            category: "command"
        };
        let router = route(commandHandler, transactionHandler, new ResponseProducer());
        router.routeCommands(createCommand);
        router.routeTransactions(command);
    });
    it("makePouchDBDriver should route removeAttachment to removeAttachmentHandler()", () => {
        let transactionHandler = {
            removeAttachmentHandler: function(transaction: ITransaction, databases: object, callback: ResponseCallback) {
                assert.ok(transaction);
            }
        };
        let commandHandler = {
            createHanlder: commandHandlers.createHanlder
        };
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let command: ITransaction = {
            database: "test",
            type: TransactionCommand[8],
            document: {},
            options: {},
            category: "command"
        };
        let router = route(commandHandler, transactionHandler, new ResponseProducer());
        router.routeCommands(createCommand);
        router.routeTransactions(command);
    });
    it("makePouchDBDriver should route getAttachment to getAttachmentHandler()", () => {
        let transactionHandler = {
            getAttachmentHandler: function(transaction: ITransaction, databases: object, callback: ResponseCallback) {
                assert.ok(transaction);
            }
        };
        let commandHandler = {
            createHanlder: commandHandlers.createHanlder
        };
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let command: ITransaction = {
            database: "test",
            type: TransactionCommand[9],
            document: {},
            options: {},
            category: "command"
        };
        let router = route(commandHandler, transactionHandler, new ResponseProducer());
        router.routeCommands(createCommand);
        router.routeTransactions(command);
    });
    it("makePouchDBDriver should throw an error if command passed that is not in TransactionCommand", () => {
        let commandHandler = {
            createHanlder: commandHandlers.createHanlder
        };
        let createCommand: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let command: ITransaction = {
            database: "test",
            type: "wrong",
            document: {},
            options: {},
            category: "command"
        };
        let router = route(commandHandler, { }, new ResponseProducer());
        router.routeCommands(createCommand);
        assert.throws(() => {
            router.routeTransactions(command);
        });
    });
    it("responseConstructor() should create object that implements IDatabaseResponse", () => {
        let expected: IDatabaseResponse = {
            database: "test",
            command: DatabaseCommand[1],
            isErr: false,
            response: "response" as any,
            category: "command"
        };
        let actual = responseConstructor("test", DatabaseCommand[1], false, "command", "response" as any);
        assert.deepEqual(actual, expected);
    });
});
describe("commandHandlers tests", () => {
    it("createHandler() should get command and object of databases and create new database and return modified databases object", () => {
        let command: ICommand = {
            database: "test",
            command: DatabaseCommand[0],
            options: {},
            category: "command"
        };
        let databases = {};
        assert.ok(commandHandlers.createHanlder(command, databases)["test"]);
    });
    it("destroyHandler() should get ICommand and call destroy with passed callback, if err is not undefined pass IDatabaseResponse with isErr true", () => {
        let expected: IDatabaseResponse = {
            database: "test",
            command: DatabaseCommand[1],
            isErr: true,
            response: "error" as any,
            category: "command"
        };
        let callback = (actual: IDatabaseResponse) => {
            assert.deepEqual(actual, expected);
        };
        let databaseStub = {
            destroy: function(options: object, complete: Function) {
                complete("error");
            }
        };
        let databases = { test: databaseStub };
        let command: ICommand = {
            database: "test",
            command: DatabaseCommand[1],
            options: {},
            category: "command"
        };
        commandHandlers.destroyHandler(command, databases, callback);
    });
    it("destroyHandler() should get ICommand and call destroy with passed callback, if err is undefined pass IDatabaseResponse with isErr false", () => {
        let expected: IDatabaseResponse = {
            database: "test",
            command: DatabaseCommand[1],
            isErr: false,
            response: "response" as any,
            category: "command"
        };
        let callback = (actual: IDatabaseResponse) => {
            assert.deepEqual(actual, expected);
        };
        let databaseStub = {
            destroy: function(options: object, complete: Function) {
                complete(undefined, "response");
            }
        };
        let databases = { test: databaseStub };
        let command: ICommand = {
            database: "test",
            command: DatabaseCommand[1],
            options: {},
            category: "command"
        };
        commandHandlers.destroyHandler(command, databases, callback);
    });
    it("destroyHandler() should get ICommand and call destroy with passed callback and return modified databases dictionary", () => {
        let expected = {};
        let callback = (res: IDatabaseResponse) => {};
        let databaseStub = {
            destroy: function(options: object, complete: Function) {
                complete(undefined, "response");
            }
        };
        let databases = { test: databaseStub };
        let command: ICommand = {
            database: "test",
            command: DatabaseCommand[1],
            options: {},
            category: "command"
        };
        let actual =  commandHandlers.destroyHandler(command, databases, callback);
        assert.deepEqual(actual, expected);
    });
    it("closeHandler() should call close method on database and pass the callback to it", () => {
        let databaseStub = {
            close: function(complete: Function) {
                complete();
            }
        };
        let expected: IDatabaseResponse = {
            database: "test",
            command: DatabaseCommand[4],
            isErr: false,
            response: { ok: true },
            category: "command"
        };
        let callback = (actual: IDatabaseResponse) => {
            assert.deepEqual(actual, expected);
        };
        let command: ICommand = {
            database: "test",
            command: DatabaseCommand[4],
            options: {},
            category: "command"
        };
        let actual = commandHandlers.closeHandler(command, { test: databaseStub }, callback);
    });
    it("keyHandler() should call transaction command, pass document, options and callback and pass response to callback", () => {
        let databaseStub = {
            get: function(doc, options, complete: Function) {
                complete(undefined, "response");
            }
        };
        let expected: IDatabaseResponse = {
            database: "test",
            command: TransactionCommand[0],
            isErr: false,
            response: "response" as any,
            category: "command"
        };
        let callback = (actual: IDatabaseResponse) => {
            assert.deepEqual(actual, expected);
        };
        let transaction: ITransaction = {
            database: "test",
            type: TransactionCommand[0],
            document: {},
            options: {},
            category: "command"
        };
        transactionHandlers.keyHandler(transaction, { test: databaseStub }, callback);
    });
    it("simpleHandler() should call transaction command, pass options and callback and pass response to callback", () => {
        let databaseStub = {
            bulkGet: function(options, complete: Function) {
                complete(undefined, "response");
            }
        };
        let expected: IDatabaseResponse = {
            database: "test",
            command: TransactionCommand[5],
            isErr: false,
            response: "response" as any,
            category: "command"
        };
        let callback = (actual: IDatabaseResponse) => {
            assert.deepEqual(actual, expected);
        };
        let transaction: ITransaction = {
            database: "test",
            type: TransactionCommand[5],
            document: {},
            options: {},
            category: "command"
        };
        transactionHandlers.simpleHandler(transaction, { test: databaseStub }, callback);
    });
    it("compactHandler() should call compact with specified parameters and pass response to response callback", () => {
        let databaseStub = {
            compact: function(options, complete: Function) {
                complete(undefined, "response");
            }
        };
        let expected: IDatabaseResponse = {
            database: "test",
            command: DatabaseCommand[2],
            isErr: false,
            response: "response" as any,
            category: "command"
        };
        let callback = (actual: IDatabaseResponse) => {
            assert.deepEqual(actual, expected);
        };
        let transaction: ICommand = {
            database: "test",
            command: DatabaseCommand[2],
            options: {},
            category: "command"
        };
        commandHandlers.compactHandler(transaction, { test: databaseStub }, callback);
    });
    it("infoHandler() should call info with specified parameters and pass response to response callback", () => {
        let databaseStub = {
            info: function(complete: Function) {
                complete(undefined, "response");
            }
        };
        let expected: IDatabaseResponse = {
            database: "test",
            command: DatabaseCommand[3],
            isErr: false,
            response: "response" as any,
            category: "command"
        };
        let callback = (actual: IDatabaseResponse) => {
            assert.deepEqual(actual, expected);
        };
        let transaction: ICommand = {
            database: "test",
            command: DatabaseCommand[3],
            options: {},
            category: "command"
        };
        commandHandlers.infoHandler(transaction, { test: databaseStub }, callback);
    });
    it("putAttachmentHandler() should call putAttachment() and pass options.docId, options.attachmentId, options.rev, document, options.type and provide callback", () => {
        let databaseStub = {
            putAttachment: function(docId, attachmentId, revs, document, type, complete: Function) {
                complete(undefined, "response");
            }
        };
        let expected: IDatabaseResponse = {
            database: "test",
            command: TransactionCommand[7],
            isErr: false,
            response: "response" as any,
            category: "command"
        };
        let callback = (actual: IDatabaseResponse) => {
            assert.deepEqual(actual, expected);
        };
        let transaction: ITransaction = {
            database: "test",
            type: TransactionCommand[7],
            options: {
                docId: 1,
                attachmentId: 1,
                revs: [ 1 ],
                type: "text/plain"
            },
            document: "response" as any,
            category: "command"
        };
        transactionHandlers.putAttachmentHandler(transaction, { test: databaseStub }, callback);
    });
    it("removeAttachmentHandler() should call putAttachment() and pass document.docId, document.attachmentId, docuemnt.rev, options and provide callback", () => {
        let databaseStub = {
            removeAttachment: function(docId, attachmentId, rev, complete: Function) {
                complete(undefined, "response");
            }
        };
        let expected: IDatabaseResponse = {
            database: "test",
            command: TransactionCommand[8],
            isErr: false,
            response: "response" as any,
            category: "command"
        };
        let callback = (actual: IDatabaseResponse) => {
            assert.deepEqual(actual, expected);
        };
        let transaction: ITransaction = {
            database: "test",
            type: TransactionCommand[8],
            options: {
                docId: 1,
                attachmentId: 1,
                rev: 1
            },
            document: { },
            category: "command"
        };
        transactionHandlers.removeAttachmentHandler(transaction, { test: databaseStub }, callback);
    });
    it("getAttachnentHandler() should call getAttachment() and pass document.docId, document.attachmentId, options and provide callback", () => {
        let databaseStub = {
            getAttachment: function(docId, attachmentId, options, complete: Function) {
                complete(undefined, "response");
            }
        };
        let expected: IDatabaseResponse = {
            database: "test",
            command: TransactionCommand[9],
            isErr: false,
            response: "response" as any,
            category: "command"
        };
        let callback = (actual: IDatabaseResponse) => {
            assert.deepEqual(actual, expected);
        };
        let transaction: ITransaction = {
            database: "test",
            type: TransactionCommand[9],
            options: {
                docId: 1,
                attachmentId: 1,
                rev: 1
            },
            document: { },
            category: "command"
        };
        transactionHandlers.getAttachmentHandler(transaction, { test: databaseStub }, callback);
    });
});
describe("querySink trests", () => {
    let producer: ResponseProducer = new ResponseProducer();
    let query: QueryDatabase = new QueryDatabase(producer);
    it("QueryDatabase.Database should filter response stream by database and return QueryResponse", () => {
        let response: IDatabaseResponse = {
            database: "test",
            command: "test",
            isErr: false,
            response: {},
            category: "command"
        };
        let stream = query.Database("test").Response().subscribe({
            next: (res: IDatabaseResponse) => {
                assert.deepEqual(res, response);
            }
        });
        producer.trigger(response);
    });
    it("QueryResponse.IsErr should filter response stream by isErr field and return QueryResponse", () => {
        let response: IDatabaseResponse = {
            database: "test",
            command: "test",
            isErr: true,
            response: {},
            category: "command"
        };
        let stream = query.Database("test").IsErr(true).Response().subscribe({
            next: (res: IDatabaseResponse) => {
                assert.deepEqual(res, response);
            }
        });
        producer.trigger(response);
    });
    it("QueryResponse.Command should flter response stream by command field and return QueryResponse", () => {
        let response: IDatabaseResponse = {
            database: "test",
            command: "test",
            isErr: true,
            response: {},
            category: "command"
        };
        let stream = query.Database("test").Command("test").Response().subscribe({
            next: (res: IDatabaseResponse) => {
                assert.deepEqual(res, response);
            }
        });
        producer.trigger(response);
    });
    it("QueryResponse.Response should return stream of responses", () => {
        let response: IDatabaseResponse = {
            database: "test",
            command: "test",
            isErr: true,
            response: {},
            category: "command"
        };
        let stream = query.Database("test").Response().subscribe({
            next: (res: IDatabaseResponse) => {
                assert.deepEqual(res, response);
            }
        });
        producer.trigger(response);
    });
    it("QueryResponse.Category should filter response stream by category field", () => {
        let response: IDatabaseResponse = {
            database: "test",
            command: "test",
            isErr: true,
            response: {},
            category: "command"
        };
        let stream$ = query.Database("test").Category("command").Response().subscribe({
            next: (actual) => {
                assert.deepEqual(actual, response);
            }
        });
        producer.trigger(response);
    });
});