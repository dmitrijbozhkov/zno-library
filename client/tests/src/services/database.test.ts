/// <reference path="../../../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../../../node_modules/@types/mocha/index.d.ts" />

import * as assert from "assert";
import { DatabaseService, DatabaseClient, InMemoryStore, AccountDatabaseService, BaseDatabaseClient } from "../../../database/database.module";
import { Observable } from "rxjs";
import { Utils } from "../../../main/utils/utils";

export function createDbMock(responses: any) {
     function db(name: string) {
        this.name = name;
    };
    db.prototype.get = function(id: string, options?: any) {
        return responses.fromGet;
    };
    db.prototype.put = function(item: any, options?: any) {
        return responses.fromPut;
    };
    db.prototype.close = function() {
        responses.closed();
    };
    db.prototype.allDocs = function() {
        responses.allDocs();
    };
    db.prototype.bulkDocs = function() {
        responses.bulkDocs();
    };
    return db;
}

describe("InMemoryStore tests", () => {
    it("get should take id and options and return promise with record if found", (done) => {
        let expected = { data: "stuff" };
        let store = new InMemoryStore({ token: expected });
        store.get("token").then((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("get should take id and options and return rejection promise if not found", (done) => {
        let expected = { error: true, message: "not found", name: "get", reason: "", status: 404};
        let store = new InMemoryStore();
        store.get("token").catch((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("put should take item and options and return promise with ok response", (done) => {
        let item = { _id: "token", data: "stuff" };
        let expected = { "OK": true };
        let store = new InMemoryStore();
        store.put(item).then((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("close should empty store and return promise with true", () => {
        let id = "token";
        let store = new InMemoryStore();
        store.close().then((response) => {
            assert.ok(response);
        });
        assert.throws(() => {
            store.get(id).then((actual) => {
                console.log(actual === null);
            });
        }, TypeError);
    });
});

describe("DatabaseClient tests", () => {
    let client: DatabaseClient<any>;
    beforeEach(() => {
        client = new DatabaseClient(new Utils());
    });
    it("getRecord should take request observable and return response observable with item", (done) => {
        let expected = { data: "stuff" };
        let returns = Promise.resolve(expected);
        let database = createDbMock({ fromGet: returns });
        client.setDb(new database("user"));
        client.getRecord(Observable.of(["id", {}])).subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("putRecord should take request observable and return response observable with item", (done) => {
        let expected = { data: "stuff" };
        let returns = Promise.resolve(expected);
        let database = createDbMock({ fromPut: returns });
        client.setDb(new database("user"));
        client.putRecord(Observable.of([expected, {}])).subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("putAllRecords should take reuest observable and return response observable with array of completion responses", (done) => {
        let database = createDbMock({ bulkDocs: () => { assert.ok(true); done(); } });
        client.setDb(new database("user"));
        client.putAllRecords(Observable.of([{}, {}])).subscribe(() => {});
    });
    it("getAllRecords should take request observable and return reponse observable with array of all records", (done) => {
        let database = createDbMock({ allDocs: () => { assert.ok(true); done(); } });
        client.setDb(new database("user"));
        client.getAllRecords(Observable.of([{}])).subscribe(() => {});
    });
    it("checkDb should take database constructor name and return true if passed name is equal to database constructor name", () => {
        let database = createDbMock({});
        client.setDb(new database("user"));
        assert.ok(client.checkDb("db"));
    });
    it("setDb should take database and put it into database filed", (done) => {
        let database = createDbMock({ closed: () => { assert.ok(true); done(); } });
        client.setDb(new database("user"));
        assert.doesNotThrow(() => {
            client.dispose();
        });
    });
    it("dispose should close database", (done) => {
        let database = createDbMock({ closed: () => { assert.ok(true); done(); } });
        client.setDb(new database("user"));
        client.dispose();
    });
});

describe("DatabaseService tests", () => {
    it("addDatabase should take database name and factory and put DatabaseClient in databases collection", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        service.addDatabase(name, InMemoryStore);
        assert.ok(service.getDatabase(name));
    });
    it("addDatabase should throw error if database exists", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        service.addDatabase(name, InMemoryStore);
        assert.throws(() => {
            service.addDatabase(name, InMemoryStore);
        });
    });
    it("getDatabase should take database name and return database client", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        service.addDatabase(name, InMemoryStore);
        assert.ok(service.getDatabase(name) instanceof DatabaseClient);
    });
    it("getDatabase should throw error if database not found", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        assert.throws(() => { service.getDatabase(name); });
    });
    it("removeDatabase should take name and remove database with that name", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        service.addDatabase(name, InMemoryStore);
        service.removeDatabase(name).then(() => {
            assert.throws(() => {
                service.getDatabase(name);
            });
        });
    });
    it("removeDatabase should throw error if database not found", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        assert.throws(() => {
            service.removeDatabase(name);
        });
    });
});

describe("AccountDatabaseService tests", () => {
    let service: AccountDatabaseService;
    beforeEach(() => {
        service = new AccountDatabaseService(new Utils());
    });
    it("getDatabase should return BaseDatabaseClient from database field", () => {
        let expected = {};
        service.addDatabase(expected as any);
        assert.ok(service.getDatabase() instanceof BaseDatabaseClient);
    });
    it("addDatabase should call setDb on database field and pass database to it", () => {
        let expected = {};
        service.addDatabase(expected as any);
        assert.deepEqual(service.getDatabase().database, expected);
    });
    it("removeDatabase should call dispose on database", (done) => {
        let database = createDbMock({ closed: () => { assert.ok(true);  done(); } });
        service.addDatabase(new database("user"));
        service.removeDatabase();
    });
    it("removeDatabase should throw exception if database client not found", () => {
        let service = new AccountDatabaseService(new Utils());
        assert.throws(() => {
            service.removeDatabase();
        });
    });
    it("setProperDb should take database constructor name, constructor for new database, new database name and database options and if constructor name is not equal to passed set new database", () => {
        let expected = { close: () => {} };
        service.addDatabase(expected as any);
        service.setProperDb("InMemoryStore", InMemoryStore);
        assert.ok(service.getDatabase().database instanceof InMemoryStore);
    });
});