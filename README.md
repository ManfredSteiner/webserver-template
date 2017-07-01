# Angular 2+ application via Express Web-Server

## Goals

* How to support the Angular 2+ application from express web-server.
* How to use a [spinner element][npm-spin] to indicate Angular application loading.

## Prerequisites

Install the module **spin**:

```
cd server
npm install --save spin
cd ..
```
Make sure, that the Angular 2+ application bundles are available in subdirectory [ng2/dist](ng2/dist). Use the following command (or keyboard shortcut *CTRL + N* ) to build them:

```
cd ng2
ng build
cd ..
```

## New files

* [src/views/ngmain.pug](src/views/ngmain.pug)

## Modified source files

* [server/src/main.ts](server/src/main.ts)



[npm-spin]: https://www.npmjs.com/package/spin
