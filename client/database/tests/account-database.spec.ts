import { DatabaseService, DatabaseClient, InMemoryStore, AccountDatabaseService, BaseDatabaseClient } from "../database.module";
import { Observable } from "rxjs";
import { Utils } from "../../main/utils/utils";

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

describe("AccountDatabaseService tests", () => {
    let service: AccountDatabaseService;
    beforeEach(() => {
        service = new AccountDatabaseService(new Utils());
    });
    it("getDatabase should return BaseDatabaseClient from database field", () => {
        let expected = {};
        service.addDatabase(expected as any);
        expect(service.getDatabase() instanceof BaseDatabaseClient).toBeTruthy();
    });
    it("addDatabase should call setDb on database field and pass database to it", () => {
        let expected = {};
        service.addDatabase(expected as any);
        expect(service.getDatabase().database).toEqual(expected as any);
    });
    it("removeDatabase should call dispose on database", (done) => {
        let database = createDbMock({ closed: () => { expect(true).toBeTruthy();   done(); } });
        service.addDatabase(new database("user"));
        service.removeDatabase();
    });
    it("removeDatabase should throw exception if database client not found", () => {
        let service = new AccountDatabaseService(new Utils());
        expect(() => {
            service.removeDatabase();
        }).toThrow();
    });
    it("setProperDb should take database constructor name, constructor for new database, new database name and database options and if constructor name is not equal to passed set new database", () => {
        let expected = { close: () => {} };
        service.addDatabase(expected as any);
        service.setProperDb("InMemoryStore", InMemoryStore);
        expect(service.getDatabase().database instanceof InMemoryStore).toBeTruthy();
    });
});