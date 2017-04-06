import { adapt } from "@cycle/run/lib/adapt";
import * as PouchDB from "pouchdb";

export type databaseList = { [database: string]: any };

export function makePouchDbDriver(databases: databaseList) {}