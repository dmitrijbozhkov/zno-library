import { ICommand, ITransaction, IDatabaseResponse, ResponseCallback, DatabaseCommand, responseConstructor } from "./makePouchDbDriver";

const PouchDB = (window as any).PouchDB;

/**
 * Creates new database and returns modified database dictionary
 * @param command Object with new database settings
 * @param databases Dictionary of databases
 */
function createHanlder(command: ICommand, databases: object): object {
    databases[command.database] = new PouchDB(command.database, command.options);
    return databases;
}

/**
 * Removes database
 * @param command Command with parameters
 * @param databases Database dictionary
 * @param callback Callback that will be called when database is removed
 */
function destroyHandler(command: ICommand, databases: object, callback: ResponseCallback): object {
    databases[command.database].destroy(command.options, (err, response) => {
        if (err) {
            callback(responseConstructor(command.database, DatabaseCommand[1], true, command.category, err));
        } else {
            callback(responseConstructor(command.database, DatabaseCommand[1], false, command.category, response));
        }
    });
    delete databases[command.database];
    return databases;
}

/**
 * Handler that closes connection to database
 * @param command Command for closing
 * @param databases Dictionary for databases
 * @param callback Callback that passes response to sink
 */
function closeHandler(command: ICommand, databases: object, callback: ResponseCallback) {
    databases[command.database].close(() => {
        callback(responseConstructor(command.database, DatabaseCommand[4], false, command.category, { ok: true }));
    });
}

/**
 * Sets debug logging
 * @param command Command with debug settings
 */
function debugHandler(command: ICommand) {
    if (command.options.debug === "enable") {
        PouchDB.debug.enable(command.options.target);
    } else if (command.options.debug === "disable") {
        PouchDB.debug.disable();
    } else {
        throw new Error("No such debug command");
    }
}

/**
 * Calls compact on specified database with specified options
 * @param command Command that sets compact operation
 * @param databases Dictionary of databases
 * @param callback Callback that will pass responses to sink
 */
function compactHandler(command: ICommand, databases: object, callback: ResponseCallback) {
    databases[command.database].compact(command.options, (err, response) => {
        if (err) {
            callback(responseConstructor(command.database, DatabaseCommand[2], true, command.category, err));
        } else {
            callback(responseConstructor(command.database, DatabaseCommand[2], false, command.category, response));
        }
    });
}

/**
 * Calls info method on specifed database
 * @param command Command that sets database
 * @param databases Dictionary of databases
 * @param callback Callbackthat will pass responses to sink
 */
function infoHandler(command: ICommand, databases: object, callback: ResponseCallback) {
    databases[command.database].info((err, response) => {
        if (err) {
            callback(responseConstructor(command.database, DatabaseCommand[3], true, command.category, err));
        } else {
            callback(responseConstructor(command.database, DatabaseCommand[3], false, command.category, response));
        }
    });
}

/**
 * Hanlders for database commands
 */
let commandHandlers = {
    createHanlder: createHanlder,
    destroyHandler: destroyHandler,
    closeHandler: closeHandler,
    debugHandler: debugHandler,
    compactHandler: compactHandler,
    infoHandler: infoHandler
};

export default commandHandlers;