import * as mongoose from 'mongoose';

import * as password from '../password';

import * as debugsx from 'debug-sx';
const debug: debugsx.IFullLogger = debugsx.createFullLogger('db:user');

const loginLogoutConfig = {
  at:      { type: Number, required: true },
  socket:  { type: String, required: true }
}

const LoginLogoutSchema = new mongoose.Schema(loginLogoutConfig);

const userSchemaConfig = {
  htlid:     { type: String, required: true, unique: true, index: true },
  surname:   { type: String, required: true },
  firstname: { type: String },
  password:  { type: String },
  login:     { type: [ LoginLogoutSchema ] },
  logout:    { type: [ LoginLogoutSchema ] },
  createdAt: { type: Number },
  savedAt:   { type: Number }
}

export const userSchema = new mongoose.Schema(userSchemaConfig);

export interface ILoginLogout {
  at: number,
  socket: string
}

export interface IUserModel {
  htlid: string,
  surname: string,
  firstname?: string,
  password?: string,
  login?: ILoginLogout [],
  logout?: ILoginLogout [],
  createdAt?: number,
  savedAt?: number
}

export interface IUser {
  htlid: string,
  surname: string,
  firstname?: string,
  password?: string,
  login?: ILoginLogout,
  logout?: ILoginLogout,
  createdAt?: number,
  savedAt?: number
}


export interface IUserObject extends IUser {
  id: string
}

export interface IUserDocument extends mongoose.Document, IUserModel {}

export class User {
  private _model: IUserDocument;

  constructor (model: IUserDocument) {
    this._model = model;
    debug.fine('id=%s, htlid %s: created (%o)', model._id, model.htlid, model.toObject());
  }

  public toObject (): IUserObject {
    const rv: IUserObject = {
      id: this._model._id,
      htlid: this._model.htlid,
      surname: this._model.surname
    };
    if (this._model.firstname) {
      rv['firstname'] = this._model.firstname;
    }
    if (this._model.password) {
      rv['password'] = this._model.password;
    }
    if (Array.isArray(this._model.login) && this._model.login.length === 1) {
      rv['login'] = { at: this._model.login[0].at, socket: this._model.login[0].socket };
    }
    if (Array.isArray(this._model.logout) && this._model.logout.length === 1) {
      rv['login'] = { at: this._model.logout[0].at, socket: this._model.logout[0].socket };
    }
    return rv;
  }

  public save(options?: mongoose.SaveOptions, fn?: (err: any, product: this, numAffected: number) => void): Promise<User>;
  public save(fn?: (err: any, product: this, numAffected: number) => void): Promise<User> {
    if (!this._model.isModified()) {
      debug.finer('id=%s, htlid=%s: save request ignored, nothing modified', this._model._id, this._model.htlid);
      return Promise.resolve(this);
    }
    return new Promise<User>( (resolve, reject) => {
      this._model.save.apply(this._model, arguments).then ( (u: IUserDocument) => {
        if (u === this._model) {
          debug.fine('id=%s, htlid=%s: save done', u._id, u.htlid);
          resolve(this);
        } else {
          debug.warn('id=%s, htlid=%s: save results wrong model', u._id, u.htlid);
          reject(new Error('unexpected response for save() on user ' + this.htlid));
        }
      }).catch ( (err: any) => {
        debug.warn(err);
        reject(err);
      });
    });
  }

  public isModified (path?: string): boolean {
    return this._model.isModified(path);
  }

  public get id (): string {
    return this._model._id;
  }

  public get htlid (): string {
    return this._model.htlid;
  }

  public get surname (): string {
    return this._model.surname;
  }

  public get firstname  (): string {
    return this._model.firstname;
  }

  public get password  (): string {
    return this._model.password;
  }

  public get login  (): ILoginLogout {
    return Array.isArray(this._model.login) ? this._model.login[0] : undefined;
  }

  public get logout (): ILoginLogout {
    return Array.isArray(this._model.logout) ? this._model.logout[0] : undefined;
  }

  // set htlid is dangerous, because htlid is unique
  // in case of existing value, error is thrown too late (on call of save())
  //
  // public set htlid (value: string) {
  //   const oldValue = this._model.htlid;
  //   if (value !== oldValue) {
  //     if (debug.finer.enabled) {
  //       debug.finer('id=%s: htlid %s -> %s', this._model._id, oldValue, value);
  //     }
  //     this._model.htlid = value;
  //   }
  // }

  public set surname (value: string) {
    const oldValue = this._model.surname;
    if (!value || value.length === 0) {
      throw new Error('empty surename not allowed');
    }
    if (value !== oldValue) {
      if (debug.finer.enabled) {
        debug.finer('id=%s, htlid=%s: surname %s -> %s', this._model._id, this._model.htlid, oldValue, value);
      }
      this._model.surname = value;
    }
  }

  public set firstname  (value: string) {
    const oldValue = this._model.firstname;
    if (value !== oldValue) {
      if (debug.finer.enabled) {
        debug.finer('id=%s, htlid=%s: firstname %s -> %s', this._model._id, this._model.htlid, oldValue, value);
      }
      this._model.firstname = value;
    }
  }

  public set login  (value: ILoginLogout) {
    const oldValue = Array.isArray(this._model.login) && this._model.login[0];
    if (value && oldValue && oldValue.at === value.at && oldValue.socket === value.socket) {
      return;
    } else if (!value && !oldValue) {
      return;
    }
    if (debug.finer.enabled) {
      debug.finer('id=%s, htlid=%s: login %o -> %o', this._model._id, this._model.htlid, oldValue, value);
    }
    this._model.markModified('login');
    if (value) {
      this._model.login[0] = value;
    } else {
      this._model.login = [];
    }
  }

  public set logout (value: ILoginLogout) {
    const oldValue = Array.isArray(this._model.logout) && this._model.logout[0];
    if (value && oldValue && oldValue.at === value.at && oldValue.socket === value.socket) {
      return;
    } else if (!value && !oldValue) {
      return;
    }
    if (debug.finer.enabled) {
      debug.finer('id=%s, htlid=%s: logout %o -> %o', this._model._id, this._model.htlid, oldValue, value);
    }
    this._model.markModified('logout');
    if (value) {
      this._model.logout[0] = value;
    } else {
      this._model.logout = [];
    }
  }

  public setPassword (value: string, options?: password.Options): boolean {
    let newValue = value;
    const oldValue = this._model.password;
    if (value && value.length > 0) {
      newValue = password.isHashed(value) ? value : password.generate(value, options);
    }
    if (this._model.password === newValue) {
      return false;
    }
    if (debug.finer.enabled) {
      debug.finer('id=%s, htlid=%s: password %s -> %s', this._model._id, this._model.htlid, oldValue, newValue);
    }
    this._model.password = newValue;
    return true;
  }

  public verifyPassword (value: string): boolean {
    return password.verify(value, this._model.password);
  }


}
