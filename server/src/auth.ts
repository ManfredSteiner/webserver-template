// import of additional modules (npm install ...)
import * as nconf from 'nconf';
import * as path from 'path';
import * as express from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
import { Strategy, IVerifyOptions, IStrategyOptionsWithRequest } from 'passport-local';

// import of Node.js modules
import * as fs from 'fs';

// import modules of this project
import { DbUser } from './db/db-user';
import { User } from './db/document/user';

import * as debugsx from 'debug-sx';
const debug: debugsx.IFullLogger = debugsx.createFullLogger('auth');


export class Auth {
  private static _instance: Auth;

  public static get Instance() {
    if (!this._instance) {
      this._instance = new this();
      Object.seal(this._instance);
      Object.seal(this._instance.constructor);
    }
    return this._instance;
  }

  public static get expressMiddleware (): express.RequestHandler [] {
    const inst = Auth.Instance;
    return [ inst.passportInit.bind(inst) ];
  }

  public static get expressMiddlewareAuthenticate (): express.RequestHandler [] {
    const inst = Auth.Instance;
    return [ inst.authenticate.bind(inst), inst.generateToken.bind(inst) ];
  }


  public static get expressMiddlewareLogin (): express.RequestHandler [] {
    const inst = Auth.Instance;
    return [ inst.authenticate.bind(inst), inst.generateToken.bind(inst)];
  }

  public static get expressMiddleWareCheckToken (): express.RequestHandler [] {
    const inst = Auth.Instance;
    return [ inst.checkToken.bind(inst), inst.deserialize.bind(inst) ];
  }


  // ****************************************************************

  private _privateKey: Buffer ;
  private _publicKey: Buffer;
  private _passport: MyPassport;
  private _expressJwt: express.RequestHandler;

  private constructor () {
    try {
      const authConfig: { privatekey: string, publickey?: string } = nconf.get('auth');
      let privFileName = authConfig.privatekey;
      if (!privFileName.startsWith('/')) {
        privFileName = path.join(__dirname, '../', privFileName);
      }
      let pubFileName = authConfig.publickey;
      if (pubFileName && !pubFileName.startsWith('/')) {
        pubFileName = path.join(__dirname, '../', pubFileName);
      }
      this._privateKey = fs.readFileSync(privFileName);
      if (pubFileName) {
        this._publicKey = fs.readFileSync(pubFileName);
      } else {
        this._publicKey = this._privateKey;
      }
      this._expressJwt = expressJwt({secret: this._publicKey});
    } catch (err) {
      console.log('Error: missing private key for authentification');
      process.exit(1);
    }
    this._passport = new MyPassport(this._privateKey)
  }

  // Passport methods

  private passportInit (req: express.Request, res: express.Response, next: express.NextFunction) {
    debug.fine('passportInit()');
    this._passport.init(req, res, next);
  }

  private authenticate (req: express.Request, res: express.Response, next: express.NextFunction) {
    debug.fine('authenticate()');
    this._passport.authenticate(req, res, next);
  }

  private generateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    debug.fine('generateToken()');
    this._passport.generateToken(req, res, next);
  }

  private checkToken (req: express.Request, res: express.Response, next: express.NextFunction) {
    debug.fine('checkToken()');
    this._expressJwt(req, res, next);
  }

  private deserialize (req: express.Request, res: express.Response, next: express.NextFunction) {
    debug.fine('deserialize()');
    if (req.user.htlid) {
      req.user.model = DbUser.Instance.getCachedUser(req.user.htlid);
    }
    next();
  }

}


class MyPassport {
  private _privateKey: Buffer;
  private _init: express.Handler;
  private _authenticate: express.Handler;

  constructor (privateKey: Buffer) {
    this._privateKey = privateKey;
    const strategyOptions: IStrategyOptionsWithRequest = { passReqToCallback: true, usernameField: 'htlid', passwordField: 'password'};
    passport.use(new Strategy(strategyOptions, this.verify));
    this._init = passport.initialize();
    this._authenticate = passport.authenticate('local', { session: false } );
  }

  public init (req: express.Request, res: express.Response, next: express.NextFunction) {
    this._init(req, res, next);
  }

  public verify (req: express.Request, username: string, password: string,
                 done: (error: any, user?: any, options?: IVerifyOptions) => void) {
    const user = DbUser.Instance.getCachedUser(username);
    const htlid = username;
    if (! (user instanceof User)) {
      debug.warn('unknown user %s', htlid);
      done(null, 'unknown user ' + htlid );
      return;
    }
    if (htlid === 'gast') {
      debug.warn('login user gast forbidden');
      done(null, 'forbidden user ' + htlid);
      return;
    }
    if (!user.verifyPassword(password)) {
      debug.info('%s %s %s -> FAILED (password verification))', req.method, req.url, htlid);
      done(null, 'invalid password on user ' + htlid);
      return;
    }

    debug.fine('%s %s %s -> OK (password verification)', req.method, req.url, htlid);
    done(null, { htlid: htlid });
  }

  public authenticate (req: express.Request, res: express.Response, next: express.NextFunction) {
    this._authenticate(req, res, next);
  }

  public generateToken (req: express.Request, res: express.Response, next: express.NextFunction) {
     if (req.user && req.user.htlid) {
      // (<any>req).token = jwt.sign((<any>{ id: req.user.id }), 'server secret', { expiresIn: '1m' }); // 2h
      (<any>req).token = jwt.sign((<any>{ htlid: req.user.htlid }), this._privateKey, { expiresIn: '10m', algorithm: 'RS256' }); // 2h;
      debug.fine('user %s found, creating token %s', req.user.htlid, (<any>req).token);
      next();
    } else {
      debug.fine('missing user --> no token created');
      next(new DbAuthError('cannot create token', req.user));
    }
  }

}

export class DbAuthError extends Error {
  private _description: string;

  constructor(message: string, description?: string) {
    super(message);
    this._description = description;
  }

  public get description (): string {
    return this._description || 'no detail description available';
  }
}
