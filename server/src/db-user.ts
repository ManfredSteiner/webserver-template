// import modules of this project
import { MongooseCollection } from './db/mongoose-collection';
import { IUser, User } from './user';

import * as debugsx from 'debug-sx';
const debug: debugsx.IDefaultLogger = debugsx.createDefaultLogger('db:DbUser');

declare function unescape (s: string): string;

export class DbUser {
  private static _instance: DbUser;

  public static get Instance() {
    if (!this._instance) {
      this._instance = new this();
      Object.seal(this._instance);
      Object.seal(this._instance.constructor);
    }
    return this._instance;
  }


  

  private constructor () {
    // Only for training purposes, never write passwords in source-code!!
    // this._db.push(new User('sx', 'Steiner', 'Manfred', 'geheim'));
    // this._db.push(new User('gast', 'Gast', '', 'gast'));
    // this._db.push(new User('greflm13', 'Greistorfer', 'Florian', 'ichmagauch'));
  }

  // public verifiyPassword (htlid: string, password: string): boolean {
  //   for (const u of this._db) {
  //     if (u.htlid !== htlid) {
  //       continue;
  //     }
  //     return u.verifyPassword(password);
  //   }
  //   return false;
  // }


  // public getUser (htlid: string): User {
  //   for (const u of this._db) {
  //     if (u.htlid === htlid) {
  //       return u;
  //     }
  //   }
  //   return undefined;
  // }


  // public login (htlid: string, socket: string): User {
  //   const user = this.getUser(htlid);
  //   if (!user) {
  //     return undefined;
  //   }
  //   user.login = { at: Date.now(), socket: socket };
  //   user.logout = undefined;
  //   return user;
  // }


  // public logout (htlid: string, socket: string): User {
  //   const user = this.getUser(htlid);
  //   if (!user) {
  //     return undefined;
  //   }
  //   user.login = undefined;
  //   user.logout = { at: Date.now(), socket: socket };
  //   return user;
  // }

}
