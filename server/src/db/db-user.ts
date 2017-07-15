import * as mongoose from 'mongoose';

import { Database } from './database';
import { MongooseDatabase } from './mongoose-database';
import { MongooseCollection } from './mongoose-collection';
import { Collection } from './collection';
import { User } from './documents/user';
import { IUser, IUserDocument, userSchema } from './schemas/user-schema';

export class DbUser extends MongooseCollection<IUser, User, IUserDocument > {

  public static createInstance (db: Database): DbUser {
    if (this._instance) {
      throw new Error('instance already created');
    }
    if (db instanceof MongooseDatabase) {
      this._instance = new this(db);
      return this._instance;
    } else {
      throw new Error('db not a MongooseDatabase');
    }
  }

  public static get Instance() {
    if (!this._instance) {
      this._instance = new this();
      Object.seal(this._instance);
      Object.seal(this._instance.constructor);
    }
    return this._instance;
  }

  public static createUser (user: IUser): Promise<User> {
    return this._instance.create(user);
  }

  // public static deleteUser (user: User): Promise<User> {
  //   return DbUser.Instance._deleteUser(user);
  // }

  // public static getUserByHtlId (htlid: string): Promise<User> {
  //   return DbUser.Instance._getUserByHtlId(htlid);
  // }

  private static _instance: DbUser;

  private _cache: { [ htlid: string ]: User };

  private constructor (db?: MongooseDatabase) {
    super('user', userSchema, db);
    this._cache = {};
  }


  public findUserByHtlId(htlid: string): Promise<User> {
    return new Promise( (resolve, reject) => {
      this._model.find({ htlid: htlid }).then(documents => {
        if (!Array.isArray(documents) || documents.length === 0) {
          resolve(undefined);
        } else if (documents.length > 1) {
          reject(new Error('More than one document for unique htlid ' + htlid));
        } else {
          const u = new User(<IUserDocument>documents[0]);
          this._cache[u.htlid] = u;
          return u;
        }
      }).catch(err => reject(err) )
    });
  }


  public getCachedUser (htlid: string) {
    return this._cache[htlid];
  }

  public clearCache (): void {
    this._cache = {};
  }


  public getCachedDocuments (): { [ htlid: string]: User } {
    return this._cache;
  }

  public login (htlid: string, socket: string) {

  }

  public logout (htlid: string, socket: string): User {
    return undefined;
  }

  protected createDocument (document: IUserDocument): User {
    const user = new User(document, this._journal);
    this._cache[user.htlid] = user;
    return user;
  }

  protected journalCreate (document: User) {
    if (this._journal.create.enabled) {
      this._journal.create('htlid=%s\n%o', document.htlid, document.toObject());
    }
  }

  protected preSave ( next: (err?: mongoose.NativeError) => void) {
    if ((<any>this)._doc) {
      const doc = <IUserDocument>(<any>this)._doc;
      if (!doc.createdAt) {
        doc.createdAt = Date.now();
        // DbUser._instance._journal.create('htlid=%s: createdAt=%d\n%o', doc.htlid, doc.createdAt, doc);
      }
    }
    next();
  }

  // private _getUserByHtlId (htlid: string): Promise<User> {
  //   const user = this._userCache[htlid];
  //   if (user) {
  //     return Promise.resolve(user);
  //   }
  //   debugger;
  //   return new Promise<User>( (resolve, reject) => {
  //     debugger;
  //     this._model.find({}, (err, users) => {
  //       debugger;
  //     });

  //     this._model.find({ htlid: htlid }).then( (users: IUserDocument []) => {
  //       debugger;
  //       if (!Array.isArray(users)) {
  //         reject(new Error('result not an array'));
  //       } else if (users.length > 1) {
  //         reject(new Error('more than one user with htlid ' + htlid));
  //       } else if (users.length < 1) {
  //         resolve(undefined); // user not found
  //       } else {
  //         const u = new User(users[0]);
  //         this._userCache[htlid] = u;
  //         resolve(u);
  //       }
  //     }).catch ( (err) => {
  //       reject(err);
  //     });
  //   });
  // };
}
