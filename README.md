# JSON Web Token

## Goals

#### Server side (Node.js express)

* How to create and verify access tokens.
* How to handle restriced data resources.

#### Client side (Angular 2+ application)

* How to login and logut the user using an access-token.
* How to get restriced data from server (server time).


## Prerequisites

Install the module **[jsonwebtoken][npm-jsonwebtoken]** and **[express-jwt][npm-express-jwt]**.

```
cd server
npm install --save jsonwebtoken @types/jsonwebtoken
npm install --save express-jwt @types/express-jwt
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

## Server side (Node.js express)

#### Modified source files

* [server/src/server.ts](server/src/server.ts)

#### New files

* [server/src/user.ts](server/src/user.ts)
* [server/src/db-user.ts](server/src/db-user.ts)
* [server/src/auth.ts](server/src/auth.ts)

## Client side (Angular 2+ application)


#### Modified source files

* [ng2/src/app/profil.component.ts](ng2/src/app/profil.component.ts)
* [ng2/src/app/app.component.ts](ng2/src/app/app.component.ts)
* [ng2/src/app/app.module.ts](ng2/src/app/app.module.ts)
* [ng2/src/app/services/user.service.ts](ng2/src/app/services/user.service.ts)

## Additional infos

* [Token based authentication][hyphe-blog-toke-based-auth]


[npm-cors]: https://www.npmjs.com/package/cors
[npm-jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
[npm-express-jwt]: https://www.npmjs.com/package/express-jwt
[hyphe-blog-toke-based-auth]: https://blog.hyphe.me/token-based-authentication-with-node/