import { DatabaseClient } from "../database.module";
import { Utils } from "../../main/utils/utils";
import { Observable } from "rxjs";

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
        return responses.closed();
    };
    db.prototype.allDocs = function() {
        return responses.allDocs();
    };
    db.prototype.bulkDocs = function() {
        return responses.bulkDocs();
    };
    return db;
}

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
            expect(actual).toEqual(expected);
            done();
        });
    });
    it("putRecord should take request observable and return response observable with item", (done) => {
        let expected = { data: "stuff" };
        let returns = Promise.resolve(expected);
        let database = createDbMock({ fromPut: returns });
        client.setDb(new database("user"));
        client.putRecord(Observable.of([expected, {}])).subscribe((actual) => {
            expect(actual).toEqual(expected);
            done();
        });
    });
    it("putAllRecords should take reuest observable and return response observable with array of completion responses", (done) => {
        let database = createDbMock({ bulkDocs: () => { return Promise.resolve("kek"); } });
        client.setDb(new database("user"));
        client.putAllRecords(Observable.of([{}, {}])).subscribe(() => {
            expect(true).toBeTruthy(); done();
        });
    });
    it("getAllRecords should take request observable and return reponse observable with array of all records", (done) => {
        let database = createDbMock({ allDocs: () => { return Promise.resolve("kek"); } });
        client.setDb(new database("user"));
        client.getAllRecords(Observable.of([{}])).subscribe(() => {
            expect(true).toBeTruthy(); done();
        });
    });
    it("checkDb should take database constructor name and return true if passed name is equal to database constructor name", () => {
        let database = createDbMock({});
        client.setDb(new database("user"));
        expect(client.checkDb("db")).toBeDefined();
    });
    it("setDb should take database and put it into database filed", (done) => {
        let database = createDbMock({ closed: () => { expect(true).toBeTruthy(); done(); } });
        client.setDb(new database("user"));
        client.dispose();
    });
    it("dispose should close database", (done) => {
        let database = createDbMock({ closed: () => { expect(true).toBeTruthy(); done(); } });
        client.setDb(new database("user"));
        client.dispose();
    });
});