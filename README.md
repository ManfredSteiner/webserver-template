# User management with MongoDB and JSON Web Token

This step continues **[step8b-json-web-token](../../blob/step8b-json-web-token/README.md)**.

## Goals

#### Server side (Node.js express)

* How to use the database **MongoDB** to manage users.
* How to use **mongoose** to implement database schemes.
* How to use **password-hash** for password hashes.

## Prerequisites

Install the [mongodb package][mongodb-install] and the 

Install the module **[jsonwebtoken][npm-jsonwebtoken]**, **[express-jwt][npm-express-jwt]**, 
**[mongoose][npm-mongoose]**, **[password-hash][npm-password-hash]** and the typescript types for
mongodb (**[@types/mongodb][npm-types-mongodb]**).

```
cd server
npm install --save jsonwebtoken @types/jsonwebtoken
npm install --save express-jwt @types/express-jwt
npm install --save mongoose @types/mongoose
npm install --save password-hash @types/password-hash
npm install --save @types/mongodb
cd ..
```

Key pairs are already available in this branch (subdirectory [server/keys](server/keys)). But you can also create your own key pair:. Replace afterwards the filenames in the configuration file (attribute `auth` in file [server/config.json](server/config.json)).

```
cd server
mkdir keys
openssl genrsa -out keys/server-private.pem
openssl rsa -in keys/server-private.pem -pubout -out keys/server-public.pem
cd ..
```


Make sure, that the Angular 2+ application bundles are available in subdirectory [ng2/dist](ng2/dist). Use the following command (or keyboard shortcut *CTRL + N* ) to build them:

```
cd ng2
ng build
cd ..
```

## Usage

You can start the express server to handle all client requests (Angular application and login POST request).

Or you can start the Angular application via `ng serve`, and start the express server as for handling the POST request. In that case the module [cors][npm-cors] must be enabled as express middleware, otherwise the request will fail.

You can verify token functionality with tool **curl**:

Get a new access token with:
```
curl -i -X POST -H 'Content-Type: application/json' -d '{ "htlid": "sx", "password": "geheim" }' localhost:8080/auth
```
Check access to restricted data with ... (replace <token> with the token you get with the previous step):
```
curl -H 'Authorization: Bearer <token>' localhost:8080/data/time
```

## MongoDB flash tutorial

Follow the link [MongoDB shell][mongodb-shell] to get some more information in detail.

The following descriptions are valid on Linux systems. 

Make sure, that the **mongod** service is running on your system:

```
sudo systemctl status mongod
sudo systemctl start mongod
```

If the service is running, you can start **MongoDB shell** with the shell command **mongo**. 
```
mongo
```

Inside the MongoDB shell you can use the following commands (and much more).

```
use webserver
show collections
db.users.find()
db.users.find({ htlid: "admin" }).pretty()
db.users.drop()
exit
```

## Configuration

The file [server/config.json](server/config.json contains configuration data for the server application 
and the user database. The array `users` contains objects which describe what's to do before the server 
application starts.

Each *user-object* must contain the attribute *command* and `user`. The attribute `command` defines the action, and the attribute *user* 
the data which are needed to perform the action.

The following commands are allowed:
* "**create**"  
  Create the specified user if it is not available in the database.
* "**modify**"  
  Change some attributes in the database (in example the password). 
* "**delete**"  
  Delete a user from database. 
* "**ignore**"  
  Ignore this object.


## OOP concept for MongoDB access

The namings in MongoDB differs a little bit from SQL oriented databases like *MySQL* or *PostgreSQL* (**DBMS** means *Database Management System*):

 SQL DBMS | MongoDB DBMS
 :----------: | :--------------:
 Database | Database 
 Table    | Collection 
 Record   | Document 
-------------------------

The directory [server/src/db](server/src/db) contains all files for database access.

* Database classes to access a MongoDB collection.  
  For example the singleton class **DbUser** in file [server/src/db/db-user.ts](server/src/db/db-user.ts)
* Subdirectory [server/src/db/core](server/src/db/core):  
  Contains all abstract classes and base classes.
* Subdirectory [server/src/db/schema](server/src/db/schema):  
  Contains schemes files to define a data model, 
  for example the file [server/src/db/schema/user-schema.ts](server/src/db/schema/user-schema.ts).
* Subdirectory [server/src/db/document](server/src/db/document):  
  All data model classes, 
  for example the file [server/src/db/document/user.ts](server/src/db/document/user.ts).

OO-Concept idea:

* **Database Management System**:  
  Singleton class **[MongooseDbms](server/src/db/core/mongoose-dbms.ts)** -> abstract class **[Dbms](server/src/db/core/dbms.ts)**
* **Database**:  
  Class **[MongooseDatabase](server/src/db/core/mongoose-database.ts)** -> abstract class **[Database](server/src/db/core/database.ts)**
* **Collection (Table)**:  
  Class **[MongooseCollection](server/src/db/core/mongoose-collection.ts)** -> abstract Class **[Collection](server/src/db/core/collection.ts)**
* **Document (Record)**:  
  Class **[User](server/src/db/document/user.ts)** -> abstract class **[MongooseDocument](server/src/db/core/mongoose-document.ts)** -> abstract class **[Document](server/src/db/core/document.ts)**
  
If you want to change the database, you just jave to replace **MongooseDbms**, **MongooseDatabase**, **MongooseCollection** and **MongooseDocument** by classes for your database replacement.

[npm-cors]: https://www.npmjs.com/package/cors
[mongodb-install]: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
[npm-jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
[npm-express-jwt]: https://www.npmjs.com/package/express-jwt
[npm-mongoose]: https://www.npmjs.com/package/mongoose
[npm-password-hash]: https://www.npmjs.com/package/password-hash
[npm-types-mongodb]: https://www.npmjs.com/package/@types/mongodb
[mongodb-shell]: [https://docs.mongodb.com/getting-started/shell/client/]