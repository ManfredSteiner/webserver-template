# Modal dialogs with Angular 4

This step continues **[step9-mongodb](../../blob/step9-mongodb/README.md)**.

## Goals

#### Server side (Node.js express)

* How to support Bootstrap V4

#### Client side (Angular v4)

* How to use Bootstrap V4
* How to use **Font Awesome Icons** as replacement for Bootstrap glyphicons
* How to implement the modal dialogs.
* How to user modal dialogs for login.
* How to dynamically create and remove components.
* How to handle authentication if user logout from another session.
* How ro implement a non angular login page
 
#### Desired behavior

Short term access token allow access on server data. If access fails the long term 
remote token can be used to get a new access token.

A new user login makes token of other sessions unuseable. In this case a modal login 
dialog should appear to relogin.

Same situation if user has logged out. In this case, all previous given tokens (access token 
and remote token) are not longer useable.

Remote tokens are valid for the same day. So re-login is needed on next day.  
Renewing an access token is done automatically by the [ServerService](ngx/src/app/services/server.service.ts). 
If the remote token is not longer valid, a modal login dialog with the previously used htlid is opened 
automatically.


## Prerequisites

Install [mongodb software package][mongodb-install].

#### From scratch ...

Execute in shell:

```
git clone -b step10-modal-dialog https://github.com/ManfredSteiner/webserver-template
cd webserver-template/ngx
npm install
npm run build
cd ../server
npm install
npm start
```

#### Alternative: continue from branch step9 ...

At the moment (july 2017) the version `@next` is needed for package `bootstrap` to ensure that Bootstrap V4 is installed.   
Also `window.__theme = 'bs4'` is needed in [server/src/views/ngmain.pug](server/src/views/ngmain.pug) and
[ngx/src/index.html](ngx/src/index.html) (see [Using with Bootstrap 4 with angular-cli][info-bootstrap4-ngx-cli]).

Install the module ...

```
cd ngx
npm install --save ngx-bootstrap bootstrap@next
npm install --save font-awesome
cd ..
```

## Usage

The [ServerService](ngx/src/app/services/server.service.ts) checks if Angular application is running 
in development mode or in production mode. The mode descides which server host is used for requests.

#### Development mode

When **ng serve** is called, the application is running in development mode. This means
that the server must be startet as seperate application on same host. All server requests
will be made to `localhost:8080` instead using the socket of the ng server (port 4200).

```
cd ngx
ng serve
```
```
cd server
npm start
```
#### Production mode

When server app should also support loading of Angular app, a build of the Angular app 
is needed every time if something changes. Angular application is build in production mode 
(see [package.json](ngx/package.json)).
```
cd ngx
npm run build
```
```
cd server
npm start
```

## Non Angular login page

Open this login page with [http://localhost:8080/login](http://localhost:8080/login). There 
is no additional login functionality implemented now.

See [server/src/views/login.pug](server/src/views/login.pug) and [server/src/views/login-style.pug](server/src/views/login-style.pug) 
how to implement:

* A fast loading login page, because Angular is not used for this page.
* How to implement an eye button beside the password field to show or hide password input.
* How to use responsive CSS to decrease icon and server name on small devices (smartphones).
* How to create a complex HTML page using pug rendering engine.

Font Awesome Icons are used, because Boootstrap V4 drops support for Glyphicons. Font Awesome is 
fully open source and is GPL friendly.  
See [http://fontawesome.io/icons/][info-fontawesome-icons].


## Additional infos

* [How to use the ngx-bootstrap component **AlertModule**][info-ngx-bootstrap-with-ng-cli]
* [Dynamically create and remove components][info-ngx-dynamic-component-loader]

[mongodb-install]: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
[npm-ngx-bootstrap]: https://www.npmjs.com/package/ngx-bootstrap
[npm-bootstrap]: https://www.npmjs.com/package/bootstrap

[info-ngx-bootstrap-with-ng-cli]: https://github.com/valor-software/ngx-bootstrap/blob/development/docs/getting-started/ng-cli.md#getting-started-with-angular-cli
[comment]: https://ponyfoo.com/articles/json-web-tokens-vs-session-cookies

[info-bootstrap4-ngx-cli]: https://github.com/valor-software/ngx-bootstrap/blob/development/docs/getting-started/bootstrap4.md#let-ngx-bootstrap-know-you-are-using-bs4

[comment]:[https://stackoverflow.com/questions/36342890/in-angular2-how-to-know-when-any-form-input-field-lost-focus
[info-ngx-dynamic-component-loader]:https://angular.io/guide/dynamic-component-loader
[info-fontawesome-icons]: http://fontawesome.io/icons/