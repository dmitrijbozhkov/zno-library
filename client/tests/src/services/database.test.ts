/// <reference path="../../../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../../../node_modules/@types/mocha/index.d.ts" />

import * as assert from "assert";
import { DatabaseService, DatabaseClient, InMemoryStore } from "../../../database/database.service";
import { Observable } from "rxjs";

function createDbMock(responses: any) {
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
    it("allDocs should return array of all database documents", (done) => {
        let expected = [ { _id: "thing", data: "stuff" } ];
        let store = new InMemoryStore();
        store.put(expected[0]);
        store.allDocs().then((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("bulkDocs should get array of documents and options and insert them", (done) => {
        let expected = [{ OK: true, id: "thing" }, { OK: true, id: "thing2" }];
        let docs = [ { _id: "thing", data: "stuff" }, { _id: "thing2", data: "stuff2" } ];
        let store = new InMemoryStore();
        store.bulkDocs(docs).then((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
});

describe("BaseDatabaseClient tests", () => {
    let client: DatabaseClient<any>;
    beforeEach(() => {
        client = new DatabaseClient();
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
    it("getRecord should take request observable and catch database errors", (done) => {
        let expected = { data: "stuff" };
        let returns = Promise.reject(expected);
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
    it("putRecord should take request observable and catch database errors", (done) => {
        let expected = { data: "stuff" };
        let returns = Promise.reject(expected);
        let database = createDbMock({ fromPut: returns });
        client.setDb(new database("user"));
        client.putRecord(Observable.of([expected, {}])).subscribe((actual) => {
            assert.deepEqual(actual, expected);
            done();
        });
    });
    it("dispose should close database", (done) => {
        let database = createDbMock({ closed: () => { assert.ok(true); done(); } });
        client.setDb(new database("user"));
        client.dispose();
    });
    it("migrate should take database factory then change database databases and return observable with populationg rsponses");
});

describe("DatabaseService tests", () => {
    it("addDatabase should take database name and factory and put DatabaseClient in databases collection", () => {
        let name = "courses";
        let service = new DatabaseService();
        service.addDatabase(name, InMemoryStore);
        assert.ok(service.getDatabase(name));
    });
    it("addDatabase should throw error if database exists", () => {
        let name = "courses";
        let service = new DatabaseService();
        service.addDatabase(name, InMemoryStore);
        assert.throws(() => {
            service.addDatabase(name, InMemoryStore);
        });
    });
    it("getDatabase should take database name and return database client", () => {
        let name = "courses";
        let service = new DatabaseService();
        service.addDatabase(name, InMemoryStore);
        assert.ok(service.getDatabase(name) instanceof DatabaseClient);
    });
    it("getDatabase should throw error if database not found", () => {
        let name = "courses";
        let service = new DatabaseService();
        assert.throws(() => { service.getDatabase(name); });
    });
    it("removeDatabase should take name and remove database with that name", () => {
        let name = "courses";
        let service = new DatabaseService();
        service.addDatabase(name, InMemoryStore);
        service.removeDatabase(name).then(() => {
            assert.throws(() => {
                service.getDatabase(name);
            });
        });
    });
    it("removeDatabase should throw error if database not found", () => {
        let name = "courses";
        let service = new DatabaseService();
        assert.throws(() => {
            service.removeDatabase(name);
        });
    });
});