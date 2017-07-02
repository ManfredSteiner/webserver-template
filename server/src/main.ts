
// import of additional modules (npm install ...)
import * as nconf from 'nconf';
import * as path from 'path';

// import of Node.js modules
import * as fs from 'fs';


// configuration
nconf.argv().env();
const configFilename = path.join(__dirname, '../config.json');
try {
  fs.accessSync(configFilename, fs.constants.R_OK);
  nconf.file(configFilename);
} catch (err) {
  console.log('Error on config file ' + configFilename + '\n' + err);
  process.exit(1);
}

let debugConfig: any = nconf.get('debug');
if (!debugConfig) {
  debugConfig = { debug: '*::*' };
}
for (const a in debugConfig) {
  if (debugConfig.hasOwnProperty(a)) {
    const name: string = (a === 'enabled') ? 'DEBUG' : 'DEBUG_' + a.toUpperCase();
    if (!process.env[name] && (debugConfig[a] !== undefined || debugConfig[a] !== undefined)) {
      process.env[name] = debugConfig[a] ? debugConfig[a] : debugConfig[a];
    }
  }
}

// logging with debug-sx/debug
import * as debugsx from 'debug-sx';
const debug: debugsx.ISimpleLogger = debugsx.createSimpleLogger('main');

debugsx.addHandler(debugsx.createConsoleHandler('stdout'));
const logfileConfig = nconf.get('logfile');
if (logfileConfig) {
  for (const att in logfileConfig) {
    if (logfileConfig.hasOwnProperty(att)) {
      const h = debugsx.createFileHandler( logfileConfig[att])
      debugsx.addHandler(h);
    }
  }
}



// import modules of this project after logger configuration
import { Server } from './server';


// start of application
const server = new Server();
server.start(8080)
  .catch( (err) => {
    debug.warn(err);
  });



