import { InMemoryStore } from "../database.module";

describe("InMemoryStore tests", () => {
    it("get should take id and options and return promise with record if found", (done) => {
        let expected = { data: "stuff" };
        let store = new InMemoryStore({ token: expected });
        store.get("token").then((actual) => {
            expect(actual).toEqual(expected);
            done();
        });
    });
    it("get should take id and options and return rejection promise if not found", (done) => {
        let expected = { error: true, message: "not found", name: "get", reason: "", status: 404};
        let store = new InMemoryStore();
        store.get("token").catch((actual) => {
            expect(actual).toEqual(expected);
            done();
        });
    });
    it("put should take item and options and return promise with ok response", (done) => {
        let item = { _id: "token", data: "stuff" };
        let expected = { "OK": true };
        let store = new InMemoryStore();
        store.put(item).then((actual) => {
            expect(actual).toEqual(expected);
            done();
        });
    });
    it("close should empty store and return promise with true", () => {
        let id = "token";
        let store = new InMemoryStore();
        store.close().then((response) => {});
        expect(() => {
            store.get(id).then((actual) => {
                console.log(actual === null);
            });
        }).toThrow();
    });
});