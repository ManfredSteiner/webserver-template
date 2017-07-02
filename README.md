# Working with Angular 2+ components

## Goals

#### Client side (Node.js express)

* How to create a login form with id and password.
* How to create an Angular 2+ service for user management.
* How to make a XML HTTP Request (XHR) in order to login a user.
* How to use a shared service in order to exchange data between two components.

#### Server side (Angular 2+ application)

* How to solve the cross origin problem when running separated servers.
* How to handle a Post request.


## Prerequisites

Install the module **[cors][npm-cors]** and **[body-parser][npm-body-parser]**

```
cd server
npm install --save cors
npm install --save body-parser @types/body-parser
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
* [server/src/views/ngmain.pug](server/src/views/ngmain.pug)

## Client side (Angular 2+ application)

#### New files

* [ng2/src/assets/logo.svg](ng2/src/assets/logo.svg)
* [ng2/src/app/service/user.service.ts](ng2/src/app/service/user.service.ts)
* [ng2/src/app/login.component.ts](ng2/src/app/login.component.ts)

#### Modified source files

* [ng2/src/app/app.component.ts](ng2/src/app/app.component.ts)
* [ng2/src/app/app.component.html](ng2/src/app/app.component.html)
* [ng2/src/app/app.component.css](ng2/src/app/app.component.css)
* [ng2/src/app/app.module.ts](ng2/src/app/app.module.ts)


## Additional infos

* [ Bootstrap CSS Forms][bootstrap-css-forms]
* [Angular 2+ template driven forms][ng2-template-driven-forms]
* [Angular 2+ HTTP Promise][ng2-http-promise]
* [Angular 2+ Services][ng2-services]

[npm-cors]: https://www.npmjs.com/package/cors
[npm-body-parser]: https://www.npmjs.com/package/body-parser
[bootstrap-css-forms]: http://getbootstrap.com/css/#forms
[ng2-template-driven-forms]: https://angular.io/guide/form-validation#simple-template-driven-forms
[ng2-http-promise]: https://angular.io/tutorial/toh-pt6#http-promise
[ng2-services]: https://angular.io/guide/architecture#services
