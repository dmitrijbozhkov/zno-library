import { DatabaseService, InMemoryStore, DatabaseClient } from "../database.module";
import { Utils } from "../../main/utils/utils";

describe("DatabaseService tests", () => {
    it("addDatabase should take database name and factory and put DatabaseClient in databases collection", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        service.addDatabase(name, InMemoryStore);
        expect(service.getDatabase(name)).toBeDefined();
    });
    it("addDatabase should throw error if database exists", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        service.addDatabase(name, InMemoryStore);
        expect(() => {
            service.addDatabase(name, InMemoryStore);
        }).toThrow();
    });
    it("getDatabase should take database name and return database client", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        service.addDatabase(name, InMemoryStore);
        expect(service.getDatabase(name) instanceof DatabaseClient).toBeTruthy();
    });
    it("getDatabase should throw error if database not found", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        expect(() => { service.getDatabase(name); }).toThrow();
    });
    it("removeDatabase should take name and remove database with that name", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        service.addDatabase(name, InMemoryStore);
        service.removeDatabase(name).then(() => {
            expect(() => {
                service.getDatabase(name);
            }).toThrow();
        });
    });
    it("removeDatabase should throw error if database not found", () => {
        let name = "courses";
        let service = new DatabaseService(new Utils());
        expect(() => {
            service.removeDatabase(name);
        }).toThrow();
    });
});