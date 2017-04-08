import { ICommand, ITransaction, IDatabaseResponse, ResponseCallback, DatabaseCommand, responseConstructor } from "./makePouchDbDriver";

/**
 * Handles put, post, get, remove and bulkDocs commands
 * @param transaction Sets up transaction
 * @param databases Dictionary of databases
 * @param callback Callback that passes result to sink
 */
function keyHandler(transaction: ITransaction, databases: object, callback: ResponseCallback) {
    databases[transaction.database][transaction.type](transaction.document, transaction.options, (err, response) => {
        if (err) {
            callback(responseConstructor(transaction.database, transaction.type, true, err));
        } else {
            callback(responseConstructor(transaction.database, transaction.type, false, response));
        }
    });
}

/**
 * Handles bulkGet and allDocs
 * @param transaction Sets up transaction
 * @param databases Dictionary of databases
 * @param callback Callback that will pass response to sink
 */
function simpleHandler(transaction: ITransaction, databases: object, callback: ResponseCallback) {
    databases[transaction.database][transaction.type](transaction.options, (err, response) => {
        if (err) {
            callback(responseConstructor(transaction.database, transaction.type, true, err));
        } else {
            callback(responseConstructor(transaction.database, transaction.type, false, response));
        }
    });
}

/**
 * Puts attachment to document
 * @param transaction Sets up transaction
 * @param databases Dictionary of databases
 * @param callback Callback that will pass response to sink
 */
function putAttachmentHandler(transaction: ITransaction, databases: object, callback: ResponseCallback) {
    databases[transaction.database].putAttachment(
        transaction.options.docId,
        transaction.options.attachmentId,
        transaction.options.revs,
        transaction.document,
        transaction.options.type,
        (err, response) => {
            if (err) {
                callback(responseConstructor(transaction.database, transaction.type, true, err));
            } else {
                callback(responseConstructor(transaction.database, transaction.type, false, response));
            }
    });
}

/**
 * Removes attachment from document
 * @param transaction Sets up transaction
 * @param databases Dictionary of databases
 * @param callback Callback that will pass response to sink
 */
function removeAttachmentHandler(transaction: ITransaction, databases: object, callback: ResponseCallback) {
    databases[transaction.database].removeAttachment(
        transaction.options.docId,
        transaction.options.attachmentId,
        transaction.options.rev,
        (err, response) => {
            if (err) {
                callback(responseConstructor(transaction.database, transaction.type, true, err));
            } else {
                callback(responseConstructor(transaction.database, transaction.type, false, response));
            }
        });
}

/**
 * Gets attachment from document
 * @param transaction Sets up transaction
 * @param databases Dictionary of databases
 * @param callback Callback that will pass response to sink
 */
function getAttachmentHandler(transaction: ITransaction, databases: object, callback: ResponseCallback) {
    databases[transaction.database].getAttachment(
        transaction.options.docId,
        transaction.options.attachmentId,
        { rev: transaction.options.rev },
        (err, response) => {
            if (err) {
                callback(responseConstructor(transaction.database, transaction.type, true, err));
            } else {
                callback(responseConstructor(transaction.database, transaction.type, false, response));
            }
        });
}

/**
 * Handers for database operations
 */
let transactionHandlers = {
    keyHandler: keyHandler,
    simpleHandler: simpleHandler,
    putAttachmentHandler: putAttachmentHandler,
    removeAttachmentHandler: removeAttachmentHandler,
    getAttachmentHandler: getAttachmentHandler
};

export default transactionHandlers;