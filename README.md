# Authorization with sessions and cookies

## Goals

#### Client side (Node.js express)

* How to get restricted data after as user after login

#### Server side (Angular 2+ application)

* How to implement cookie based sessions on express-server.
* How to restrict data access, depending on if user is verified.

## Prerequisites

Install the module **[passport][npm-passport]**, **[passport-local][npm-passport-local]**, **[cookie-parser][npm-cookie-parser]** and **[express-session][npm-express-session]**.

```
cd server
npm install --save passport @types/passport
npm install --save passport-local @types/passport-local
npm install --save cookie-parser @types/cookie-parser
npm install --save express-session @types/express-session
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

Hold in mind, that authorization with cookies will only work if Angular 2+ application server and data-server have the same hostname!
If you run the Angular 2+ application with `ng serve`, then getting time from server will fail.

## Server side (Node.js express)

#### Modified source files

* [server/src/server.ts](server/src/server.ts)
* [server/config.json](server/config.json)


## Client side (Angular 2+ application)

#### Modified source files

* [ng2/src/app/profil.component.ts](ng2/src/app/profil.component.ts)
* [ng2/src/app/services/user.service.ts](ng2/src/app/services/user.service.ts)


## Additional infos

* [Understanding passport.js authentification][toon-passport]
* [Tutorial Authentication with passport][tutsplus-passport]

[npm-cors]: https://www.npmjs.com/package/cors
[npm-passport]: https://www.npmjs.com/package/passport
[npm-passport-local]: https://www.npmjs.com/package/passport-local
[npm-cookie-parser]: https://www.npmjs.com/package/cookie-parser 
[npm-express-session]: https://www.npmjs.com/package/express-session
[toon-passport]: http://toon.io/understanding-passportjs-authentication-flow/
[tutsplus-passport]: https://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619