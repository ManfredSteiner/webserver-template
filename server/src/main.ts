
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

// start of application

import { Database } from './db/database';
import { DbUser } from './db/db-user';
import { Dbms } from './db/dbms';

import * as mongoose from 'mongoose';
(<any>mongoose).Promise = Promise;

const startupPromisses: Promise<void> [] = [];

startupPromisses.push(new Promise<void>( (resolve, reject) => {
  Dbms.openDatabase('webserver').then( db => {
    debug.info('Database %s connected', db.name());
    const dbUser = DbUser.createInstance(db);
    dbUser.findAll().then( users => {
      debug.info('%s users found', users.length);
      const cachedUsers = dbUser.getCachedDocuments();
      const user = cachedUsers['admin'];
      if (!user) {
        dbUser.create({ htlid: 'admin', surname: 'Admin', password: 'geheim' }).then( adminUser => {
          resolve();
        }).catch( err => reject(err) );
      } else {
        resolve();
      }
    }).catch( err => { reject(err) } );
  })
}));

import { Server } from './server';

Promise.all(startupPromisses).then( () => {
  const server = new Server();
  server.start(8080).catch( (err) => {
    debug.warn(err);
  });
}).catch( err => {
  console.log('Error: Startup fails');
  console.log(err);
  process.exit(1);
})

