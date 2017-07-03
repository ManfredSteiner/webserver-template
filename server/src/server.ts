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
import { DbUser } from './db-user';

// logging with debug-sx/debug
import * as debugsx from 'debug-sx';
const debug: debugsx.IDefaultLogger = debugsx.createDefaultLogger('server');


export class Server {
  private _app: express.Application;
  private _server: net.Server;
  private _logger: express.RequestHandler;
  private _serverAdmin: IServerAdmin;

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
    this._app.post('/login', this.handlePostLogin.bind(this));
    this._app.post('/logout', this.handlePostLogout.bind(this));
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
        debug.fine('socket %s connected', clientSocket);
        socket.on('close', () => {
          debug.fine('socket %s closed', clientSocket);
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


  private handlePostLogin (req: express.Request, res: express.Response, next: express.NextFunction) {
    const data = req.body;
    if (!data || typeof(data.htlid) !== 'string' || typeof(data.password) !== 'string' ||
        data.htlid.length < 2 || data.htlid.length > 8 ) {
      res.status(400).json({ 'error' : 'Missing or wrong parameters' });
      return;
    }
    debugger;
    if (!DbUser.Instance.verifiyPassword(data.htlid, data.password)) {
      debug.warn('User %s: Login fails', data.htlid);
      res.status(401).json({ 'error' : 'Wrong htlid or wrong password' });
      return;
    }
    const socket: string = req.socket.remoteAddress + ':' + req.socket.remotePort;
    const user = DbUser.Instance.login(data.htlid, socket);
    const u = Object.assign({}, user);
    delete u.passwordHash;
    debug.info('User %s: login succeeded', u.htlid);
    res.json(u);
  }

  private handlePostLogout (req: express.Request, res: express.Response, next: express.NextFunction) {
    const data = req.body;
    if (!data || typeof(data.htlid) !== 'string') {
      res.status(400).json({ 'error' : 'Missing or wrong parameters' });
      return;
    }
    const socket: string = req.socket.remoteAddress + ':' + req.socket.remotePort;
    const user = DbUser.Instance.logout(data.htlid, socket);
    debug.info('User %s: logout succeeded', user.htlid);
    res.json({ message: 'User ' + data.htlid + ' logged out'});
  }


  private error404Handler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const clientSocket = req.socket.remoteAddress + ':' + req.socket.remotePort;
    debug.warn('Error 404 for %s %s from %s', req.method, req.url, clientSocket);
    res.status(404).render('error404.pug');
  }


  private errorHandler (err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) {
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
