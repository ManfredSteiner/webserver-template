
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

import { Database } from './db/database';
import { DbUser } from './db/db-user';
import { Dbms } from './db/dbms';
import { Server } from './server';

import * as mongoose from 'mongoose';
(<any>mongoose).Promise = Promise;

Dbms.openDatabase('webserver').then( db => {
  debug.info('Database %s connected', db.name());
  const dbUser = DbUser.createInstance(db);
  dbUser.findAll().then( users => {
    debug.info('%s users found', users.length);
    const cachedUsers = dbUser.getCachedDocuments();
    const user = cachedUsers['sx'];
    if (!user) {
      debugger;
      dbUser.create({ htlid: 'sx', surname: 'Steiner'}).catch( err => debug.warn(err) );
    } else {
      debugger;
      user.surname = 'Goofies';
      user.save().then( saved => {
        debug.info('saved: %s', saved);
      }).catch( err => debug.warn(err) );
    }
  }).catch( err => { debug.warn(err); } );

}).catch( err => { debug.warn(err)} );

// import modules of this project after logger configuration



// start of application
// const server = new Server();
// server.start(8080)
//   .catch( (err) => {
//     debug.warn(err);
//   });


// import * as mongoose from 'mongoose';
// import { DbUser } from './db/db-user';

// // import * as bluebird from 'bluebird';
// // (<any>mongoose).Promise = bluebird;
// (<any>mongoose).Promise = Promise;

// // type mongoose.ConnectionOptions not working yet
// const mongoConfig = {
//   useMongoClient: true,
//   config: {
//   //    autoIndex: true
//   }
// };

// mongoose.createConnection('mongodb://localhost/webserver', mongoConfig).then( () => {

  // const promise: Promise<mongoose.Connection> = <any>mongoose.createConnection('mongodb://localhost/webserver', mongoConfig) ;
  // promise.then( (conn) => {
  //   debugger;
  //   conn.db.listCollections({}).toArray().then( result => {
  //     debugger;
  //   });
  // });

  // dbConnection.on('open', (arg) => {
  //   debugger;
  //   debug.info('%o', arg);
  //   const collections = dbConnection.modelNames();
  //   debug.info('%o', collections);
  //   debug.info('readyState: %s', dbConnection.readyState);
  //   console.log(dbConnection.collections);
  //   debug.info(' DB opened');

  //   // DbUser.createUser( { htlid: 'sx', surname: 'Steiner' })
  // });

  // dbConnection.open('mongodb://localhost/webserver').then( () => {
  //   debugger;
  //   debug.info(' DB opened');
  // });

// mongoose.connect('mongodb://localhost/webserver', mongoConfig).then( () => {
//   DbUser.getUserByHtlId('no').then( user => {
//     debugger;
//     if (user) {
//       debug.info(user.toObject());
//       // user.login = { at: 2000, socket: 'super' };
//       // user.login = undefined;
//       user.setPassword('geheim', { algorithm: 'md5'});
//       user.save().catch(this.handleError);
//       console.log(user.verifyPassword('geheim'));
//       console.log(user.verifyPassword('gehei1'));


//     } else {
//       DbUser.createUser( { htlid: 'no', surname: 'Nöhrer' }).then (user => {
//         debug.info('User created');
//         user.firstname = 'Peter';
//         user.setPassword('geheim');
//         user.save().catch( (err) => { debug.warn(err); });
//       }).catch ( err => {
//         debug.warn(err);
//       });
//     }

//   }).catch( err => { debug.warn(err); } );


// }).catch( err => {
//   console.log('Error: cannot connect to mongod');
//   process.exit(1);
// });



// Database.createInstance('webserver').then( (db) => {
//   debugger;
//   console.log(db.isConnected());
//   DbUser.getUserByHtlId('no').then(user => {
//     debug.info(user);
//   }).catch(err => this.handleError);
// }).catch( err => this.handleError);
