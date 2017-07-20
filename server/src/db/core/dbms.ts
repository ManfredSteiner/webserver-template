import * as mongoose from 'mongoose';
import * as nconf from 'nconf';

import { Database } from './database';
import { MongooseDatabase } from './mongoose-database';

import * as debugsx from 'debug-sx';
const debug: debugsx.ISimpleLogger = debugsx.createSimpleLogger('db:dbms');

export class Dbms {

  public static openDatabase (name?: string): Promise<Database> {
    if (!name || name.length === 0) {
      const databaseConfig = nconf.get('database');
      if (databaseConfig) {
        name = databaseConfig.name;
      }
    }
    let db = Dbms._databaseMap[name];
    if (db) {
      Promise.reject(new Error('Database ' + name + ' already created'));
    }
    db = new MongooseDatabase();
    Dbms._databaseMap[name] = db;
    return db.connect(name);
  }

  public static getDatabase (name?: string): Database {
    if (!name || name.length === 0) {
      const dbCnt = Object.keys(Dbms._databaseMap).length;
      switch (dbCnt) {
        case 0: return undefined;
        case 1: return Dbms._databaseMap[Object.keys(Dbms._databaseMap)[0]];
        default: throw new Error('More than one database available, use name to specify which database');
      }
    }
    return Dbms._databaseMap[name];
  }

  private static _databaseMap: { [ name: string]: MongooseDatabase } = {};

}

