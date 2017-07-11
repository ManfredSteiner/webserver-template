import * as mongoose from 'mongoose';

import { Journal } from '../journal';
import { MongooseDocument } from '../mogoose-document';
import { Document } from '../document';
import { IUserDocument } from '../schemas/user';

export class User extends MongooseDocument<IUser, IUserDocument> implements IUser {

  constructor (document: IUserDocument, journal?: Journal) {
    super(document, journal);
  }

  public toObject (): IUser {
    return {
      id: this._document._id,
      htlid: this._document.htlid,
      surname: this._document.surname
    }
  }

  public save (): Promise<boolean> {
    this._document.savedAt = Date.now();
    return super.save();
  }

  protected journalSet (attributeName: string, oldValue: any, newValue: any) {
    if (this._journal && this._journal.set.enabled) {
      this._journal.set('htlid=%s, %s: %s -> %s', this.htlid, attributeName, oldValue, newValue);
    }
  }

  protected journalSave () {
    if (this._journal && this._journal.save.enabled) {
      this._journal.save('htlid=%s', this.htlid);
    }
  }

  protected journalDone () {
    if (this._journal && this._journal.done.enabled) {
      this._journal.done('htlid=%s', this.htlid);
    }
  }


  public get htlid (): string {
    return this._document.htlid;
  }

  public get surname (): string {
    return this._document.surname;
  }

  public set surname (value: string) {
    this.setStringAttribute('surname', value);
  }

}

export interface IUser {
  id?: string;
  htlid: string;
  surname: string;
}
