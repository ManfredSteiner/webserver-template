# Express middleware

## Goals

* How to use the rendering engine **[pug][pug]** (recent name *jade*) to generate HTML response.
* How to create and insert express middleware to create HTTP 404 errors (Not found) and HTTP 500 errors (Internal Server Error) in case of exceptions.
* How to use **Bootstrap**, the ...
  > *most popular HTML, CSS and JS framework for developing responsive,     mobile first projects on the web.*

  ... in order to prettify the HTML response

## Prerequisites

Install the module **bootstrap**:

```
cd server
npm install --save bootstrap
```

## New files

* [server/src/views/links.pug](server/src/views/links.pug)
* [server/src/views/error404.pug](server/src/views/error404.pug)
* [server/src/views/error500.pug](server/src/views/error500.pug)



[pug]: https://pugjs.org/api/getting-started.html