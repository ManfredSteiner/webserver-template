
// import of additional modules (npm install ...)
import * as express from 'express';
import * as path from 'path';

// import of Node.js modules
import * as http from 'http';

// logging with debug-sx/debug
process.env['DEBUG'] = '*';
import * as debugsx from 'debug-sx';
const debug: debugsx.ISimpleLogger = debugsx.createSimpleLogger('main');

// web-server
const serverApp = express();
serverApp.set('views', path.join(__dirname, '/views'));
const pugEngine = serverApp.set('view engine', 'pug');
pugEngine.locals.pretty = true;

// middleware for web-server
serverApp.use(requestHandler);

// start of application
const server = http.createServer(serverApp).listen(8080);
debug.info('Server running on port 8080');


// ***************************************************************************
// Functions
// ***************************************************************************

function requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
  const clientSocket = req.socket.remoteAddress + ':' + req.socket.remotePort;
  if (req.method === 'GET' && req.url === '/') {
    debug.info('%s %s from %s', req.method, req.url, clientSocket);
    res.send('It works');
  } else {
    debug.warn('%s %s from %s', req.method, req.url, clientSocket);
    next();
  }
}

