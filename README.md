# React Redux Universal (isomorphic) bundle

[![works badge](https://cdn.rawgit.com/nikku/works-on-my-machine/v0.2.0/badge.svg)](https://github.com/nikku/works-on-my-machine)
[![Build Status](https://travis-ci.org/lancetw/react-isomorphic-bundle.svg)](https://travis-ci.org/lancetw/react-isomorphic-bundle)
[![Dependency Status](https://david-dm.org/lancetw/react-isomorphic-bundle.svg)](https://david-dm.org/lancetw/react-isomorphic-bundle)
[![devDependency Status](https://david-dm.org/lancetw/react-isomorphic-bundle/dev-status.svg)](https://david-dm.org/lancetw/react-isomorphic-bundle#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/lancetw/react-isomorphic-bundle/badge.svg?branch=master)](https://coveralls.io/r/lancetw/react-isomorphic-bundle?branch=master)
[![Code Climate](https://codeclimate.com/github/lancetw/react-isomorphic-bundle/badges/gpa.svg)](https://codeclimate.com/github/lancetw/react-isomorphic-bundle)

## DEMO

http://react.deliverwork.co

---

Learning from [isomorphic-flux-boilerplate](https://github.com/iam4x/isomorphic-flux-boilerplate) but use [Redux](https://github.com/gaearon/redux).

```

$ npm install -g nodemon webpack babel
$ npm install

edit `./config/sequelize/config.json`

change `dialect` from "postgres" to "sqlite" if you want a simple start.

```

---

## DEV MODE

`npm run dev` (*wait until console show: "webpack: bundle is now VALID".*)

**Press "Ctrl + h" to switch redux devtools**

* open `http://127.0.0.1:3000`
* open `http://127.0.0.1:3002` (BrowserSync)

## PRODUCTION MODE

### Linux/Mac
`npm start`

### Windows (Git Bash)
`npm run prestart && NODE_ENV=production npm run win-start`


## DEBUG MODE

`npm run debug`

* open `http://127.0.0.1:8080/debug?ws=127.0.0.1:8080&port=5858`
* open `http://127.0.0.1:3000`

---

## Features

- [x] isomorphic flux, supports JSON Web Tokens (JWT) and Sessions (levelDB)
- [x] flummox changes to redux@3.0.0
- [x] react-router@1.0.0rc1
- [x] Register
- [x] Log in
- [x] Facebook Sign In
- [x] restful API with JWT
- [x] change password
- [x] create posts
- [x] modify posts
- [x] delete posts
- [x] i18n / language switcher
- [x] files/images uploader (Dropzone)
- [x] Ad scripts support
- [x] location Settings (Google maps with HTML5 Geolocation)
- [x] post list with Infinite Scroll
- [x] post list with Calendar
- [x] serverside Async data-fetching (thanks [universal-redux-boilerplate](https://github.com/savemysmartphone/universal-redux-boilerplate))
- [x] full text Search
- [x] image slider
- [x] admin pages
- [ ] sitemap
- [ ] static archive pages
- [ ] testing suite
- [ ] more ...

---

## You May Be Interested In...

* [redux](https://github.com/gaearon/redux)
* [flummox](https://github.com/acdlite/flummox)
* [react-router](https://github.com/rackt/react-router)
* [universal-redux-boilerplate](https://github.com/savemysmartphone/universal-redux-boilerplate)
* [isomorphic-flux-boilerplate](https://github.com/iam4x/isomorphic-flux-boilerplate)
* [tcomb-form](https://github.com/gcanti/tcomb-form)
* [parameter](https://github.com/node-modules/parameter)
* [Semantic UI](http://semantic-ui.com/)
* [koa](https://github.com/koajs/koa)
* [koa-resource-router](https://github.com/alexmingoia/koa-resource-router)
* [koa-router](https://github.com/alexmingoia/koa-router)
* [koa-generic-session](https://github.com/koajs/generic-session)
* [leveldb](https://github.com/google/leveldb)
* [koa-level](https://github.com/purposeindustries/koa-level)
* [passport](https://github.com/jaredhanson/passport)
* [passport-facebook](https://github.com/jaredhanson/passport-facebook)
* [passport-jwt](https://github.com/themikenicholson/passport-jwt)
* [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
* [sequelize](https://github.com/sequelize/sequelize)
* [superagent](https://github.com/visionmedia/superagent)
* [webpack](https://github.com/webpack/webpack)
* [postcss](https://github.com/postcss/postcss)
* [postscribe](https://github.com/krux/postscribe)
* [babeljs](https://github.com/babel/babel)
* [react-hot-loader](https://github.com/gaearon/react-hot-loader)
* [react-translate-component](https://github.com/martinandert/react-translate-component)
* [react-dropzone](https://github.com/paramaggarwal/react-dropzone)
* [react-day-picker](https://github.com/gpbl/react-day-picker)
* [google-map-react](https://github.com/istarkov/google-map-react)
* [react-list](https://github.com/orgsync/react-list)
* [Css Shake](http://elrumordelaluz.github.io/csshake/)
* [react-paginate](https://github.com/AdeleD/react-paginate)
* [nuka-carousel](https://github.com/kenwheeler/nuka-carousel)
