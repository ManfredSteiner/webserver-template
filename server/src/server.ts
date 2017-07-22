// import of additional modules (npm install ...)
import * as express from 'express';
import * as path from 'path';
import * as morgan from 'morgan';
import * as nconf from 'nconf';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

// import of Node.js modules
import * as net from 'net';
import * as http from 'http';
import * as fs from 'fs';

// import modules of this project
import { DbUser } from './db/db-user';
import { IUser } from './db/schema/user-schema';
import { User } from './db/document/user';
import { Auth, DbAuthError } from './auth';

// logging with debug-sx/debug
import * as debugsx from 'debug-sx';
const debug: debugsx.IFullLogger = debugsx.createFullLogger('server');


export class Server {
  private _app: express.Application;
  private _server: net.Server;
  private _logger: express.RequestHandler;
  private _serverAdmin: IServerAdmin;
  private _authorization_uri: string;

  constructor () {
    const loggerConfig = nconf.get('morgan');
    if (typeof(loggerConfig) === 'string') {
      this._logger = morgan('dev', { stream: fs.createWriteStream(loggerConfig, {flags: 'a'}) } );
      console.log('morgan logging to file \'' + loggerConfig + '\'.');
    } else if (loggerConfig === false) {
      console.log('morgan logging disabled.');
    } else {
      this._logger = morgan('dev');
    }
    this._serverAdmin = nconf.get('admin');
    if (!this._serverAdmin) {
      console.log('Error: missing config admin');
      process.exit(1);
    }
    const authConfig = nconf.get('auth');
    this._authorization_uri = authConfig && authConfig.authorization_uri;

    this._app = express();
    this._app.set('views', path.join(__dirname, '/views'));
    const pugEngine = this._app.set('view engine', 'pug');
    pugEngine.locals.pretty = true;

    // the first middleware cors is only needed when the Angular 2+
    // application is started separatly with ng serve!
    this._app.use(cors());
    this._app.use(this._logger);
    this._app.use(this.requestHandler.bind(this));
    this._app.use(express.static(path.join(__dirname, 'public')));
    this._app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
    this._app.use('/ng2', express.static(path.join(__dirname, '../../ng2/dist')));
    this._app.use('/assets', express.static(path.join(__dirname, '../../ng2/dist/assets')));
    this._app.get('/error', this.handleGetError.bind(this));
    this._app.use(bodyParser.json());

    this._app.use(Auth.expressMiddleware);
    this._app.post('/auth', Auth.expressMiddlewareAuthenticate, this.handleAuth.bind(this));
    this._app.use(bodyParser.urlencoded({ extended: true }) );
    this._app.use(Auth.expressMiddleWareCheckToken);
    this._app.use(this.handleAuthenticatedRequest.bind(this));
    this._app.use('/logout', this.handleLogout.bind(this));

    this._app.get('/data/*', this.handleGetData.bind(this));
    this._app.use(this.error404Handler.bind(this));
    this._app.use(this.errorHandler.bind(this));
  }

  public start (defaultPort?: number): Promise<Server> {
    const serverConfig = nconf.get('server');
    const port = (serverConfig && serverConfig.port) || defaultPort;

    if (!port) {
      console.log('Error: missing port');
      process.exit(1);
    }

    return new Promise<Server> ( (resolve, reject) => {
      this._server = http.createServer(this._app).listen(port, () => {
        debug.info('Express web-server listening, start http://localhost:%s/', port);
        resolve(this);
      });

      this._server.on('connection', socket => {
        const clientSocket = socket.remoteAddress + ':' + socket.remotePort;
        debug.finer('socket %s connected', clientSocket);
        socket.on('close', () => {
          debug.finer('socket %s closed', clientSocket);
        });
      });

      this._server.on('error', err => {
        debug.warn(err);
        if (err.toString().startsWith('Error: listen EADDRINUSE')) {
          console.log('Error: port ' + port + ' already in use!');
          process.exit(1);
        }
      });
    });
  }


   public stop (): Promise<boolean> {
     return new Promise<boolean>( (resolve, reject) => {
       if (!this._server) {
         resolve(false);
       } else {
         this._server.close( () => {
           resolve(true);
         });
       }
     });
   }

  private requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const clientSocket = req.socket.remoteAddress + ':' + req.socket.remotePort;
    debug.info('%s %s from %s', req.method, req.url, clientSocket);
    if (req.method === 'GET' &&
        (req.url === '/' || req.url === '/index.html' || req.url === '/login' ||
         req.url.startsWith('/app')) ) {
      res.render('ngmain.pug');
    } else {
      next();
    }
  }


  private handleGetError () {
    throw new Error('This simulates an exception....');
  }


  private handleAuth (req: IRequestWithToken, res: express.Response, next: express.NextFunction) {
    if (!req.user) {
      throw new Error('auth fails, missing user');
    }
    if (!req.token) {
      throw new Error('auth fails, missing token');
    }
    debug.fine('handleAuth(): response htlid and token');
    const socket: string = req.socket.remoteAddress + ':' + req.socket.remotePort;
    DbUser.Instance.login(req.user.htlid, socket);
    res.json({ htlid: req.user.htlid, token: req.token });
  }


  private handleAuthenticatedRequest (req: IRequestWithUser, res: express.Response, next: express.NextFunction) {
    if (!req.user || !req.user.iat || !req.user.exp || !req.user.model || !(req.user.model instanceof User)) {
      debug.warn('request %s %s not authenticated', req.method, req.originalUrl);
      res.status(401).json({ error: 'Not authenticated'});
      return;
    }
    // req.user.iat = req.user.iat * 1000; // convert to epoch time in milliseconds
    // req.user.exp = req.user.exp * 1000; // convert to epoch time in milliseconds
    if (req.user.model.logout) {
      debug.warn('request %s %s not authenticated (user logout)', req.method, req.originalUrl);
      res.status(401).json({ error: 'Not authenticated'});
      return;
    }
    const login = req.user.model.login;
    // login.at is epoch time in milliseconds
    // rq.user.iat (from jsonwebtoken) is epach tim in seconds)
    if (!login || Math.floor(login.at / 1000) > req.user.iat) {
      debug.warn('request %s %s not authenticated (token iat before login)', req.method, req.originalUrl);
      res.status(401).json({ error: 'Not authenticated'});
      return;
    }
    next();
  }


  private handleLogout (req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = req.user && req.user.model;
    const socket: string = req.socket.remoteAddress + ':' + req.socket.remotePort;
    const u = DbUser.Instance.logout(user.htlid, socket);
    if (u instanceof User) {
      debug.info('User %s: logout succeeded', user.htlid);
      res.json({ message: 'User ' + user.htlid + ' logged out'});
    } else {
      debug.info('User %s: already logged out', user.htlid);
      res.json({ message: 'User ' + user.htlid + ' already logged out'});
    }
  }


  private handleGetData (req: IRequestWithUser, res: express.Response, next: express.NextFunction) {
    debug.fine('handleGetData()');
    if (req.url === '/data/time') {
      const value = { time: new Date().toISOString() };
      debug.fine('send response: %o', value)
      res.json(value);
      return;
    } else if (req.url === '/data/user') {
      const u: IUser = req.user.model.toObject();
      debug.fine('response data for user %s', u.htlid);
      res.json(u);
      return;
    }
    next();
  }


  private error404Handler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const clientSocket = req.socket.remoteAddress + ':' + req.socket.remotePort;
    debug.warn('Error 404 for %s %s from %s', req.method, req.url, clientSocket);
    res.status(404).render('error404.pug');
  }


  private errorHandler (err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err instanceof DbAuthError) {
      const v = 'Bearer authorization_uri="' + this._authorization_uri +
                '", error="' + err.message + '", error_description="' + err.description + '"';
      res.setHeader('WWW-Authenticate', v);
      debug.fine('response HTTP 400 - Authorization fails')
      res.status(400).send('Authorization fails\n');
      return;
    }
    if (err instanceof Error && err.name === 'UnauthorizedError') {
      // err is thrown inside module jsonwebtoken
      res.status(401);
      debug.fine('response HTTP 401 - Unauthorized')
      res.render('error401.pug')
      return;
    }

    const ts = new Date().toISOString();
    debug.warn('Error %s\n%e', ts, err);
    res.status(500).render('error500.pug',
      {
        time: ts,
        href: 'mailto:' + this._serverAdmin.mail + '?subject=' + ts,
        serveradmin: this._serverAdmin.name
      });
  }

}


interface IServerAdmin {
  name: string;
  mail: string;
}

interface IRequestWithUser extends express.Request {
  user: { htlid: string, iat: number, exp: number, model: User};
}

interface IRequestWithToken extends IRequestWithUser {
  token: string
}


