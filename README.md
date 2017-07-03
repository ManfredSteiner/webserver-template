# Login and Logout

## Goals

#### Client side (Node.js express)

* How to use the router module if user is logged in.
* How to implement the logout.
* How to show a flash message if login fails.

#### Server side (Angular 2+ application)

* How to create a singleton for user management.
* How to create and verify a password hash


## Prerequisites

Install the module **[jssha][npm-jssha]**.

```
cd server
npm install --save jssha @types/jssha
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

## Server side (Node.js express)

#### Modified source files

* [server/src/server.ts](server/src/server.ts)

#### New files

* [server/src/db-user.ts](server/src/db-user.ts)

## Client side (Angular 2+ application)

#### New files

* [ng2/src/app/profil.component.ts](ng2/src/app/profil.component.ts)
* [ng2/src/app/app-routing.module.ts](ng2/src/app/app-routing.module.ts)

#### Modified source files

* [ng2/src/app/app.component.ts](ng2/src/app/app.component.ts)
* [ng2/src/app/app.module.ts](ng2/src/app/app.module.ts)
* [ng2/src/app/services/user.service.ts](ng2/src/app/services/user.service.ts)


## Additional infos

* [Bootstrap Alerts][bootstrap-alerts]
* [Angular 2+ Routing & Navigation][ng2-routing]

[npm-cors]: https://www.npmjs.com/package/cors
[npm-jssha]: https://www.npmjs.com/package/jssha
[bootstrap-alerts]: http://getbootstrap.com/components/#alerts
[ng2-routing]: https://angular.io/guide/router
