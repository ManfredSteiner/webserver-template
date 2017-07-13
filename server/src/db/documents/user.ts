import * as mongoose from 'mongoose';


import { Journal } from '../journal';
import { MongooseDocument } from '../mogoose-document';
import { IUserLoginLogout } from '../schemas/user-schema';
import { Document } from '../document';
import { IUser, IUserDocument, IUserRecord } from '../schemas/user-schema';
import * as password from '../password';

export class User extends MongooseDocument<IUserRecord, IUserDocument> implements IUserRecord {

  constructor (document: IUserDocument, journal?: Journal) {
    super(document, journal);
  }

  public toObject (): IUserRecord {
    const obj: IUserRecord = {
      id: this._document._id,
      createdAt: this._document.createdAt,
      htlid: this._document.htlid,
      surname: this._document.surname
    }
    const firstname = this._document.firstname;
    if (firstname) {
      (<any>obj).firstname = firstname
    }
    const passwordHash = this._document.firstname;
    if (passwordHash) {
      (<any>obj).passwordHash = passwordHash
    }
    const savedAt = this._document.savedAt;
    if (savedAt) {
      (<any>obj).savedAt = savedAt;
    }
    const login = Array.isArray(this._document.login) ? this._document.login[0] : undefined;
    if (login) {
      (<any>obj).login = login;
    }
    const logout = Array.isArray(this._document.logout) ? this._document.logout[0] : undefined;
    if (logout) {
      (<any>obj).logout = logout;
    }
    return obj;
  }

  public save (): Promise<boolean> {
    this._document.savedAt = Date.now();
    return super.save();
  }

  public get htlid (): string {
    return this._document.htlid;
  }

  public get surname (): string {
    return this._document.surname;
  }

  public get firstname (): string {
    return this._document.firstname;
  }

  public get password (): string {
    return this._document.password;
  }

  public get login (): IUserLoginLogout {
    const nestedObject: IUserLoginLogout [] = (<any>this._document).login;
    return Array.isArray(nestedObject) && nestedObject.length === 1 ? nestedObject[0] : undefined;
  }

  public get logout (): IUserLoginLogout {
    const nestedObject: IUserLoginLogout [] = (<any>this._document).logout;
    return Array.isArray(nestedObject) && nestedObject.length === 1 ? nestedObject[0] : undefined;
  }

  public set surname (value: string) {
    this.setStringAttribute('surname', value);
  }

  public set firstname (value: string) {
    this.setStringAttribute('firstname', value);
  }

  public set passwordHash (value: string) {
    this.setStringAttribute('passwordHash', value);
  }


  public set login (value: IUserLoginLogout) {
    const nestedObject: IUserLoginLogout [] = (<any>this._document).login;
    const oldValue: IUserLoginLogout = Array.isArray(nestedObject) && nestedObject.length === 1 ? nestedObject[0] : undefined;
    if ((!oldValue && !value) || (oldValue && value && oldValue.at === value.at && oldValue.socket === value.socket)) {
      return; // nothing new to set
    }
    (<any>this._document).login = [ value ];
    this._document.markModified('login');
    this.journalSet('login', oldValue, value);
  }


  public set logout (value: IUserLoginLogout) {
    const nestedObject: IUserLoginLogout [] = (<any>this._document).logout;
    const oldValue: IUserLoginLogout = Array.isArray(nestedObject) && nestedObject.length === 1 ? nestedObject[0] : undefined;
    if ((!oldValue && !value) || (oldValue && value && oldValue.at === value.at && oldValue.socket === value.socket)) {
      return; // nothing new to set
    }
    (<any>this._document).logout = [ value ];
    this._document.markModified('logout');
    this.journalSet('logout', oldValue, value);
  }


  public set password (value: string) {
    let newValue = value;
    const oldValue = this._document.password;
    if (value && value.length > 0) {
      newValue = password.isHashed(value) ? value : password.generate(value);
    }
    this._document.password = newValue;
  }

  public verifyPassword (value: string): boolean {
    return password.verify(value, this._document.password);
  }

  // The journal methods are implemented in base class Document and can be
  // overwritten here, in order to print the journal with htlid instead of mongod id.

  protected defaultJournalPrefix (): string {
    return 'htlid=' + this.htlid + ' (id=' + this.id + ')';
  }

}

