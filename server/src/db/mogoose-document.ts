import * as mongoose from 'mongoose';

import { Document } from './document';
import { Journal } from './journal';

export abstract class MongooseDocument<T, MD extends mongoose.Document> extends Document<T> {

  protected _document: MD;

  constructor (document: MD, journal?: Journal) {
    super(journal);
    this._document = document;
  }

  public get id (): string {
    return this._document._id;
  }

  public save (): Promise<boolean> {
    if (!this._document.isModified()) {
      return Promise.resolve(false);
    } else {
      return new Promise( (resolve, reject) => {
        // this.journalSave();
        this._document.save().then( result => {
          this.journalDone();
          resolve(true);
        }).catch( err => {
          this.journalErr(err);
          reject(err);
        });
      });
    }
  }

  protected setStringAttribute (name: string, value: string) {
    const oldValue = this._document.get(name);
    if (oldValue !== value) {
      this._document.set(name, value);
      this.journalSet(name, oldValue, value);
    }
  }


}
