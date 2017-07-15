import * as mongodb from 'mongodb';
import * as mongoose from 'mongoose';

import * as debugsx from 'debug-sx';

import { Dbms } from './dbms';
import { MongooseDatabase } from './mongoose-database';
import { Document } from './document';
import { Collection } from './collection';
import { MongooseDocument } from './mogoose-document';


export abstract class MongooseCollection<T, D extends Document<T>, MD extends mongoose.Document> extends Collection<T, D> {
  protected _model: mongoose.Model<MD>;
  protected _schema: mongoose.Schema;

  constructor(name: string, schema: mongoose.Schema, db?: MongooseDatabase) {
    super(name);
    schema.pre('init', this.preInit);
    schema.pre('save', this.preSave);
    schema.pre('validate', this.preValidate);
    schema.pre('remove', this.preRemove);
    schema.post('init', this.postInit);
    schema.post('save', this.postSave);
    schema.post('validate', this.postValidate);
    schema.post('remove', this.postRemove);
    this._schema = schema;
    // this._model = mongoose.model<D>(name, schema);
    if (!db) {
      db = <MongooseDatabase>Dbms.getDatabase();
      if (!db) {
        throw new Error('No database connected');
      }
    }
    this._model = db.model<MD>(name, schema);
  }

  public findAll(): Promise<D []> {
    return this.find({});
  }

  public find (conditions: Object): Promise<D []> {
    return new Promise( (resolve, reject) => {
      this._model.find(conditions).then(documents => {
        const rv: D [] = [];
        for (const d of documents) {
          rv.push(this.createDocument(d));
        }
        resolve(rv);
      }).catch( err => reject(err) );
    });
  }


  public create (item: T): Promise<D> {
    return new Promise<D>( (resolve, reject) => {
      this._model.create(item).then( (d) => {
        const document = this.createDocument(d);
        this.journalCreate(document);
        resolve(document);
      }).catch( err => { reject(err); } );
    });
  }


  public delete(item: D): Promise<boolean> {
    return new Promise<boolean>( (resolve, reject) => {
      this._model.remove((<any>item)._document).then( res => {
        const result: mongodb.DeleteWriteOpResultObject = <any>res;
         if (result.result.ok && result.result.n === 1) {
           resolve(true);
         } else {
           reject(new Error('unexpected response og mongodb'));
         }
      }).catch( err => reject(err) );
    });
  }

  public clearCache (): void {
    throw new Error('no cache implemented');
  }

  public refreshCache (): Promise<{[ id: string]: D}> {
    return Promise.reject(new Error('no cache refresh implemented'));
  }

  public getCachedDocuments (): { [ id: string]: D } {
    throw new Error('no cache implemented');
  }

  protected abstract createDocument (document: mongoose.Document): D;

  // public findAll(): Promise<T[]> {
  //   return new Promise<T[]>( (resolve, reject) =>  {
  //     return this._model.find({}).then( items => {
  //       for (const item of items) {
  //         const id = item._id;
  //         if (this._cache[id]) {
  //           this._cache[id] = this.createDocument(item);
  //         }
  //       }
  //     });
  //   });
  // }

  // protected update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
  //   this._model.update({ _id: _id }, item, callback);
  // }

  // protected delete(_id: string, callback: (error: any, result: any) => void) {
  //   this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
  // }

  // protected findById(_id: string, callback: (error: any, result: T) => void) {
  //   this._model.findById(_id, callback);
  // }

  // protected findOne(cond?: Object, callback?: (err: any, res: T) => void): mongoose.Query<T> {
  //   return this._model.findOne(cond, callback);
  // }

  // protected find (cond?: Object, fields?: Object, options?: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]> {
  //   return this._model.find(cond, options, callback);
  // }

  protected preInit ( next: (err?: mongoose.NativeError) => void) { next(); }
  protected preValidate ( next: (err?: mongoose.NativeError) => void) { next(); }
  protected preSave ( next: (err?: mongoose.NativeError) => void) { next(); }
  protected preRemove ( next: (err?: mongoose.NativeError) => void) { next(); }
  protected postInit (doc: mongoose.Document): void {}
  protected postSave (doc: mongoose.Document): void {}
  protected postValidate (doc: mongoose.Document): void {}
  protected postRemove (doc: mongoose.Document): void {}



  private toObjectId(_id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id);
  }
}
