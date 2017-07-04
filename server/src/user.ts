// import of additional modules (npm install ...)
import * as jssha from 'jssha';

import * as debugsx from 'debug-sx';
const debug: debugsx.ISimpleLogger = debugsx.createSimpleLogger('user');

declare function unescape (s: string): string;


export class User {

  public static createPasswordHash (password: string): string {
    // A simple hash is a weak method for password checking.
    // Use improved methods in productive mode!
    const pwBytes = User.str2Uint8Array(password);
    const shaObj = new jssha('SHA-256', 'ARRAYBUFFER');
    shaObj.update(<any>pwBytes);
    const hash = shaObj.getHash('HEX');
    return hash;
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
  // ****************************************************************

  private _htlid: string;
  private _surname: string;
  private _firstname: string;
  private _passwordHash: string;
  private _login?: ILoginLogout;
  private _logout?: ILoginLogout;

  constructor (htlid: string, surname: string, firstname?: string, password?: string) {
    if (htlid === undefined || typeof(htlid) !== 'string' || htlid.length < 2 || htlid.length > 8) {
      throw new Error('missing htlid');
    }
    if (surname === undefined || typeof(surname) !== 'string' || surname.length < 1) {
      throw new Error('missing surname');
    }
    if (firstname && typeof(firstname) !== 'string') {
      throw new Error('wrong firstname');
    }
    if (password && (typeof(password) !== 'string' || password.length < 4)) {
      throw new Error('invalid password');
    }

    this._htlid = htlid;
    this._surname = surname;
    this._firstname = firstname;
    this._passwordHash = User.createPasswordHash(password);
  }

  public get htlid (): string {
    return this._htlid;
  }

  public get surname (): string{
    return this._surname;
  }

  public get firstname (): string{
    return this._firstname;
  }

  public get passwordHash (): string{
    return this._passwordHash;
  }

  public get login (): ILoginLogout{
    return this._login;
  }

  public get logout (): ILoginLogout{
    return this._logout;
  }

  public set surname (value: string) {
    if (value === undefined || typeof(value) !== 'string' || value.length < 1) {
      throw new Error('missing value');
    }
    this._surname = value;
  }

  public set firstname (value: string) {
    this._firstname = value;
  }

  public set password (value: string) {
    if (value && (typeof(value) !== 'string' || value.length < 4)) {
      throw new Error('invalid password');
    }
    this._passwordHash = User.createPasswordHash(value);
  }

  public set login (value: ILoginLogout) {
    this._login = value;
  }

  public set logout (value: ILoginLogout) {
    this._logout = value;
  }

  public verifyPassword (password: string) {
    if (password && typeof(password) === 'string' && password.length >= 4 && this._passwordHash) {
      const hash = User.createPasswordHash(password);
      return typeof(hash) === 'string' && hash.length > 0 && hash === this._passwordHash;
    }
    return false;
  }

  public toObject (): IUser {
    return {
      htlid: this._htlid,
      surname: this._surname,
      firstname: this._firstname,
      login: this._login,
      logout: this._logout
    };
  }

  public toString (): string {
    return this._htlid + '(' + (this.firstname ? this._firstname + ' ' : '') + this._surname;
  }

}


export interface ILoginLogout {
  at: number;
  socket: string;
}

export interface IUser {
  htlid: string;
  surname: string;
  firstname: string;
  login?: { at: number, socket: string };
  logout?: { at: number, socket: string };
}
