# Web-Server/Client

## Introduction

This project combines a Node.js/Express Web-Server and a Angular 2+ Web-Client (based on Angular CLI). This project is using Visual Studio Code as development environment (IDE).

See also:
* [Node.js][nodejs]
* [Express][express] 
* [Angular 2+][angular]
* [Angular CLI][angular-cli]
* [Visual Studio Code][vsc]

## Prerequisites

Make sure that you have installed on your system:
* Node.js
* Visual Studio Code
* Angular CLI


Now clone the project from git repository, install all modules in the subdirectory *server* (Node.js/Express server) and the subdirectory *ng2* (Angular2 app). If you want to start a Angular 2+ project from scratch, remove the *ng2* subdirectory and recreate it with Angular-Cli.

```
git clone <project>
cd <project>
cd server
npm install
cd ../ng2
npm install
cd ..
code .
```
To recreate the Angular 2+ project use...

```
rm -r ng2
ng new ng2
```

## Visual Studio Code

There are many extensions available. It' strongly recommended to install the following extensions:

* TSLint

The Web-Server subproject is using [Gulp][gulp] as building control tool. To combine some actions with keyboard shortcuts, copy the content of [.vscode/keybindings.json](.vscode/keybindings.json) to your personal Keyboard shortcut definition (menu *File->Preferences->Keyboard Shortcuts*). Then the following keyboard shortcuts are available:

* CTRL + C ... Clean project
* CTRL + V ... Clean and build project
* CTRL + B ... Build project
* CTRL + N ... Build Angular 2+ project

To start the Web-Server press:

* F5 ... start in debugging mode
* CTRL + F5 ... start normal (without debugging)

## Branches

Use command `git checkout <branch>` to get one of the following branches:

* [step1-express-middleware](docs/step1-express-middleware.md)  
  + How to create and insert middleware functionality to the web-server.
  + How to prettify your HTML response using *Bootstrap*.
  + How to simplify creation of HTML response using the rendering engine *pug*.

* [ step2-provide-ng2-app ](docs/step2-provide-ng2-app.md)  
  + How to support the Angular 2+ application from express web-server.
  + How to use a [spinner element][npm-spin] to indicate Angular application loading.
  
[nodejs]: https://nodejs.org/en/
[express]: https://github.com/expressjs/express
[angular]: https://angular.io/
[angular-cli]: https://cli.angular.io/
[vsc]: https://code.visualstudio.com/
[gulp]: http://gulpjs.com/

