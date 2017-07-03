
import * as jssha from 'jssha';

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

  private static str2Uint8Array (str: string): Uint8Array  {
    const utf8 = unescape(encodeURIComponent(str));
    const arr = [];
    for (let i = 0; i < utf8.length; i++) {
      arr.push(utf8.charCodeAt(i));
    }
    const buffer = new ArrayBuffer(arr.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < arr.length; i++) {
      bufferView[i] = arr[i];
    }
    return bufferView;
  }

  private static createPasswordHash (password: string): string {
    // A simple hash is a weak method for password checking.
    // Use improved methods in productive mode!
    const pwBytes = DbUser.str2Uint8Array(password);
    const shaObj = new jssha('SHA-256', 'ARRAYBUFFER');
    shaObj.update(<any>pwBytes);
    const hash = shaObj.getHash('HEX');
    return hash;
  }


  private _db: IUser [] = [];

  private constructor () {
    // Only for training purposes, never write passwords in source-code!!
    this._db.push(this.addUser('sx', 'Steiner', 'Manfred', 'geheim'));
    this._db.push(this.addUser('gast', 'Gast', '', 'gast'));
    this._db.push(this.addUser('greflm13', 'Greistorfer', 'Florian', 'ichmagauch'));
  }

  public addUser (htlid: string, surname: string, firstname: string, password: string): IUser {
    return {
      htlid: htlid,
      surname: surname,
      firstname: firstname,
      passwordHash: DbUser.createPasswordHash(password)
    }
  }

  public verifiyPassword (htlid: string, password: string): boolean {
    const hash = DbUser.createPasswordHash(password);
    for (const u of this._db) {
      if (u.htlid !== htlid) {
        continue;
      }
      return u.passwordHash === hash;
    }
    return false;
  }

  public getUser (htlid: string): IUser {
    for (const u of this._db) {
      if (u.htlid === htlid) {
        return u;
      }
    }
    return undefined;
  }

}

export interface IUser {
  htlid: string;
  surname: string;
  firstname: string;
  passwordHash: string;
}
