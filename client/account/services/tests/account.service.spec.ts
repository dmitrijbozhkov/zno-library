import { TestBed, async, getTestBed } from "@angular/core/testing";
import { AccountService } from "../account.service";
import { AccountHttpService } from "../../../http/http.module";
import { LoadingService } from "../../../main/load/loading.service";
import { AccountDatabaseService } from "../../../database/account-database.service";
import { Observable } from "rxjs";
import { InMemoryStore } from "../../../database/inMemoryStore";

class AccountHttpMock {
    public fromLogin;
    public fromCreate;
    public loginUser(params) { return this.fromLogin(params); }
    public createUser(params) { return this.fromCreate(params); }
}
class AccountDatabaseMock {
    public fromAdd;
    public fromGet;
    public fromDb;
    public fromPut;
    public fromStore;
    public fromRemove;
    public fromSet;
    public isSetDb() { return this.fromSet(); }
    public addDatabase(database) { this.fromDb = this; return this.fromAdd(database); };
    public getDatabase() { return this.fromDb; };
    public getRecord(request) {
        return this.fromGet(request);
    };
    public putRecord(params) { return this.fromPut(params); }
    public setProperDb(name, constr) { return this.fromStore(name, constr); }
    public removeRecord(record) { return this.fromRemove(record); }
}
class LoadingMock {
    public fromStart;
    public fromComplete;
    public fromEnd;
    public onStart() { return this.fromStart(); }
    public onComplete(comp) { return this.fromComplete(comp); }
    public onEnd() { return this.fromEnd(); }
}
class WindowMock {
    public PouchDB = function(name, options) { this.name = name; this.options = options; };
}

describe("Tests for AccountService", () => {
    let service: AccountService;
    let http: AccountHttpMock;
    let database: AccountDatabaseMock;
    let load: LoadingMock;
    let mockWindow: WindowMock;
    beforeEach(async(() => {
        TestBed.configureTestingModule({ providers: [
            AccountService,
            { provide: AccountHttpService, useClass: AccountHttpMock },
            { provide: AccountDatabaseService, useClass: AccountDatabaseMock },
            { provide: LoadingService, useClass: LoadingMock },
            { provide: Window, useClass: WindowMock }
        ]
        });
        let bed = getTestBed();
        service = bed.get(AccountService);
        http = bed.get(AccountHttpService);
        database = bed.get(AccountDatabaseService);
        load = bed.get(LoadingService);
        mockWindow = bed.get(Window);
    }));
    it("initAccount should start with pending token state in state", (done) => {
        database.fromGet = () => { return Observable.never(); };
        database.fromAdd = () => { return true; };
        database.fromSet = () => false;
        database.fromDb = database;
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        service.initAccount();
        service.state.subscribe((state) => {
            expect(state).toBe(0);
            done();
        });
    });
    it("initAccount should call addDatabase with new database with name user and auto_compaction set to true", (done) => {
        let expected = new mockWindow.PouchDB("user", { auto_compaction: true });
        database.fromGet = () => { return Observable.never(); };
        database.fromAdd = (actual) => { expect(actual).toEqual(expected); done(); };
        database.fromSet = () => false;
        database.fromDb = database;
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        service.initAccount();
    });
    it("initAccount should call checkAuth and if user is authorized pass authorized account state to state", (done) => {
        database.fromGet = () => { return Observable.of(true); };
        database.fromAdd = (actual) => { return true; };
        database.fromSet = () => false;
        database.fromDb = database;
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        service.initAccount();
        service.state.skip(1).subscribe((state) => {
            expect(state).toBe(2);
            done();
        });
    });
    it("initAccount should call checkAuth and if user is not authorized pass unauthorized account state to state", (done) => {
        database.fromGet = () => { return Observable.throw("err"); };
        database.fromAdd = (actual) => { return true; };
        database.fromSet = () => false;
        database.fromDb = database;
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        service.initAccount();
        service.state.skip(1).subscribe((state) => {
            expect(state).toBe(1);
            done();
        });
    });
    it("checkAuth should onStart on loading", (done) => {
        database.fromGet = () => { return Observable.throw("err"); };
        database.fromAdd = (actual) => { return true; };
        database.fromDb = database;
        load.fromStart = () => { expect(true).toBeTruthy(); done(); };
        load.fromEnd = () => { return true; };
        service.checkAuth();
    });
    it("chekcAuth should call onEnd on loading when got response", (done) => {
        database.fromGet = () => { return Observable.of("kek"); };
        database.fromAdd = (actual) => { return true; };
        database.fromDb = database;
        load.fromStart = () => { return true; };
        load.fromEnd = () => { expect(true).toBeTruthy(); done(); };
        service.checkAuth().subscribe();
    });
    it("checkAuth should call getRecord on database and pass observable with request parameters", (done) => {
        database.fromGet = (params) => { return params; };
        database.fromAdd = (actual) => { return true; };
        database.fromDb = database;
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        let expected = ["token", {}];
        service.checkAuth().subscribe((actual) => {
            expect(actual).toEqual(expected as any);
            done();
        });
    });
    it("logIn should call onStart on loading", (done) => {
        load.fromStart = () => { expect(true).toBeTruthy(); done(); };
        load.fromEnd = () => { return true; };
        database.fromDb = database;
        http.fromLogin = () => { return Observable.never(); };
        database.fromPut = () => { return Observable.never(); };
        service.logIn({ email: "kek@mail.ru", password: "pass1234", remember: true });
    });
    it("logIn should call loginUser with observable of credentials", (done) => {
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        database.fromDb = database;
        let expected = { email: "kek@mail.ru", password: "pass1234", remember: true };
        http.fromLogin = (cred) => {
            cred.subscribe((actual) => {
                expect(actual).toEqual(expected);
                done();
            });
            return Observable.never();
        };
        database.fromPut = () => { return Observable.never(); };
        service.logIn(expected);
    });
    it("logIn should call handleLogin with http response and remember and call onComplete with value 50", (done) => {
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        database.fromStore = () => {};
        let expected = 50;
        load.fromComplete = (actual) => { expect(actual).toBe(expected); done(); };
        database.fromDb = database;
        http.fromLogin = (cred) => {
            return Observable.of({ json: () => { return cred; } });
        };
        database.fromPut = (stream) => { return stream; };
        service.logIn({ email: "kek@mail.ru", password: "pass1234", remember: true }).subscribe();
    });
    it("logIn should call setProperDb with 'InMemoryStore' and InMemoryStore constructor if remember is false", (done) => {
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        load.fromComplete = (actual) => { return true; };
        database.fromDb = database;
        http.fromLogin = (cred) => {
            return Observable.of({ json: () => { return cred; } });
        };
        database.fromPut = (stream) => { return stream; };
        database.fromStore = (name, ctor) => {
            expect(name).toBe("InMemoryStore");
            expect(ctor instanceof InMemoryStore);
            done();
        };
        service.logIn({ email: "kek@mail.ru", password: "pass1234", remember: false }).subscribe();
    });
    it("logIn should call setProperDb with 'Te', PouchDB, 'user' and auto_compaction false if remember is true", (done) => {
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        load.fromComplete = (actual) => { return true; };
        database.fromDb = database;
        http.fromLogin = (cred) => {
            return Observable.of({ json: () => { return cred; } });
        };
        database.fromPut = (stream) => { return stream; };
        database.fromStore = (name, ctor) => {
            expect(name).toBe("Te");
            expect(ctor).toEqual(mockWindow.PouchDB);
            done();
        };
        service.logIn({ email: "kek@mail.ru", password: "pass1234", remember: true }).subscribe();
    });
    it("logIn should call putRecord with handled http response", (done) => {
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        load.fromComplete = (actual) => { return true; };
        database.fromDb = database;
        let credentials = { email: "kek@mail.ru", password: "pass1234", remember: true };
        http.fromLogin = (cred) => {
            return Observable.of({ json: () => { return credentials; } });
        };
        let expected = { email: "kek@mail.ru", password: "pass1234", remember: true, _id: "token" };
        database.fromPut = (stream) => {
            stream.subscribe((actual) => {
                expect(actual[0]).toEqual(expected);
                done();
            });
            return Observable.never();
        };
        database.fromStore = (name, ctor) => { return true; };
        service.logIn(credentials).subscribe();
    });
    it("logIn should call onEnd on loading", (done) => {
        load.fromStart = () => { expect(true).toBeTruthy(); done(); };
        load.fromEnd = () => { return true; };
        load.fromComplete = (actual) => { return true; };
        database.fromDb = database;
        let credentials = { email: "kek@mail.ru", password: "pass1234", remember: true };
        http.fromLogin = (cred) => {
            return Observable.of({ json: () => { return credentials; } });
        };
        let expected = { email: "kek@mail.ru", password: "pass1234", remember: true, _id: "token" };
        database.fromPut = (stream) => {
            return stream;
        };
        database.fromStore = (name, ctor) => { return true; };
        service.logIn(credentials).subscribe();
    });
    it("logIn should pass authorized TokenState if no error", (done) => {
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        load.fromComplete = (actual) => { return true; };
        database.fromDb = database;
        let credentials = { email: "kek@mail.ru", password: "pass1234", remember: true };
        http.fromLogin = (cred) => {
            return Observable.of({ json: () => { return credentials; } });
        };
        let expected = { email: "kek@mail.ru", password: "pass1234", remember: true, _id: "token" };
        database.fromPut = (stream) => {
            return stream;
        };
        database.fromStore = (name, ctor) => { return true; };
        service.logIn(credentials).subscribe();
        service.state.subscribe((actual) => {
            expect(actual).toBe(2);
            done();
        });
    });
    it("logIn should pass unauthorized TokenState if error occured", (done) => {
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        load.fromComplete = (actual) => { return true; };
        database.fromDb = database;
        let credentials = { email: "kek@mail.ru", password: "pass1234", remember: true };
        http.fromLogin = (cred) => {
            return Observable.throw({ json: () => { return credentials; } });
        };
        let expected = { email: "kek@mail.ru", password: "pass1234", remember: true, _id: "token" };
        database.fromPut = (stream) => {
            return stream;
        };
        database.fromStore = (name, ctor) => { return true; };
        service.logIn(credentials).subscribe(() => {}, () => {});
        service.state.subscribe((actual) => {
            expect(actual).toBe(1);
            done();
        });
    });
    it("logOff should call onStart on loading", (done) => {
        database.fromDb = database;
        database.fromGet = () => { return Observable.of("stuff"); };
        database.fromRemove = () => { return Observable.of("kek"); };
        load.fromStart = () => { expect(true).toBeTruthy(); done(); };
        load.fromEnd = () => { return true; };
        service.logOff().subscribe();
    });
    it("logOff should call getRecord on database with observable of 'token' name", (done) => {
        database.fromDb = database;
        database.fromGet = (request) => {
            request.subscribe((actual) => {
                expect(actual[0]).toBe("token");
                done();
            });
            return Observable.never();
        };
        database.fromRemove = () => { return Observable.of("kek"); };
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        service.logOff().subscribe();
    });
    it("logOff should call removeRecord with token", (done) => {
        database.fromDb = database;
        let expected = { email: "kek@mail.ru", password: "pass1234", remember: true, _id: "token" };
        database.fromGet = (request) => {
            return Observable.of(expected);
        };
        database.fromRemove = (request) => {
            request.subscribe((actual) => {
                expect(actual[0]).toEqual(expected);
                done();
            });
            return Observable.never();
        };
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        service.logOff().subscribe();
    });
    it("logOff should call onEnd on loading", (done) => {
        database.fromDb = database;
        let expected = { email: "kek@mail.ru", password: "pass1234", remember: true, _id: "token" };
        database.fromGet = (request) => {
            return Observable.of(expected);
        };
        database.fromRemove = (request) => {
            return Observable.of("kek");
        };
        load.fromStart = () => { return true; };
        load.fromEnd = () => { expect(true).toBeTruthy(); done(); };
        service.logOff().subscribe();
    });
    it("logOff should pass unauthorized TokenState if no error", (done) => {
        database.fromDb = database;
        let expected = { email: "kek@mail.ru", password: "pass1234", remember: true, _id: "token" };
        database.fromGet = (request) => {
            return Observable.of(expected);
        };
        database.fromRemove = (request) => {
            return Observable.of("kek");
        };
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        service.logOff().subscribe();
        service.state.subscribe((actual) => {
            expect(actual).toBe(1);
            done();
        });
    });
    it("create should call onStart on loading", (done) => {
        http.fromCreate = () => { return Observable.never(); };
        load.fromStart = () => { expect(true).toBeTruthy(); done(); };
        load.fromEnd = () => { return true; };
        service.create({} as any);
    });
    it("create should call createUser on http with observable of passed credentials", (done) => {
        let expected = { credentrials: "kek" };
        http.fromCreate = (cred) => {
            cred.subscribe((actual) => {
                expect(actual).toEqual(expected);
                done();
            });
            return Observable.never();
        };
        load.fromStart = () => { return true; };
        load.fromEnd = () => { return true; };
        service.create(expected as any);
    });
    it("create should call onEnd on loading", (done) => {
        http.fromCreate = () => { return Observable.of("kek"); };
        load.fromStart = () => { return true; };
        load.fromEnd = () => { expect(true).toBeTruthy(); done(); };
        service.create({} as any).subscribe();
    });
});