import { IAccountDatabase } from "./interfaces";

/**
 * Stores information in memory
 */
export class InMemoryStore<T> implements IAccountDatabase {
    private store: { [item: string]: T };
    constructor(store?: { [item: string]: T }) {
        if (!store) {
            this.store = {};
        } else {
            this.store = store;
        }
        // console.log(this.store);
    }

    /**
     * Returns document by id
     * @param id Id of document
     * @param options Options for getting document
     */
    public get(id: string, options?: any) {
        if (this.store[id]) {
            return Promise.resolve(this.store[id]);
        } else {
            return Promise.reject({ error: true, message: "not found", name: "get", reason: "", status: 404});
        }
    }

    /**
     * Puts new document in database
     * @param item Item to put
     * @param options Options for putting options
     */
    public put(item: T, options?: any) {
        this.store[(item as any)._id] = item;
        return Promise.resolve({ "OK": true });
    }

    /**
     * Removes document
     * @param doc Database document
     * @param options Database removal options
     */
    public remove(doc: T, options?: any) {
        if (this.store[(doc as any)._id]) {
            delete this.store[(doc as any)._id];
            return Promise.resolve({ "OK": true });
        } else {
            return Promise.reject({ error: true, message: "not found", name: "get", reason: "", status: 404});
        }
    }

    /**
     * Closes database
     */
    public close() {
        this.store = null;
        return Promise.resolve(true);
    }
}