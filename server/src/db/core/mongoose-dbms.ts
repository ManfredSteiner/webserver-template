import * as mongoose from 'mongoose';
import * as nconf from 'nconf';

import { Dbms } from './dbms';
import { Database } from './database';
import { MongooseDatabase } from './mongoose-database';

import * as debugsx from 'debug-sx';
const debug: debugsx.ISimpleLogger = debugsx.createSimpleLogger('db:dbms');

export class MongooseDbms extends Dbms {

  public static get Instance() {
    if (!this._instance) {
      this._instance = new this();
      Object.seal(this._instance);
      Object.seal(this._instance.constructor);
    }
    return this._instance;
  }

 private static _instance: MongooseDbms;

  // **************************************************************************

  private _databaseMap: { [ name: string]: MongooseDatabase } = {};

  public openDatabase (name?: string): Promise<Database> {
    if (!name || name.length === 0) {
      const databaseConfig = nconf.get('database');
      if (databaseConfig) {
        name = databaseConfig.name;
      }
    }
    let db = this._databaseMap[name];
    if (db) {
      Promise.reject(new Error('Database ' + name + ' already created'));
    }
    db = new MongooseDatabase();
    this._databaseMap[name] = db;
    return db.connect(name);
  }

  public getDatabase (name?: string): MongooseDatabase {
    if (!name || name.length === 0) {
      const dbCnt = Object.keys(this._databaseMap).length;
      switch (dbCnt) {
        case 0: return undefined;
        case 1: return this._databaseMap[Object.keys(this._databaseMap)[0]];
        default: throw new Error('More than one database available, use name to specify which database');
      }
    }
    return this._databaseMap[name];
  }

}

