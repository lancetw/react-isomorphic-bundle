# React Redux Universal (isomorphic) bundle
[![works badge](https://cdn.rawgit.com/nikku/works-on-my-machine/v0.2.0/badge.svg)](https://github.com/nikku/works-on-my-machine)
[![Build Status](https://travis-ci.org/lancetw/react-isomorphic-bundle.svg)](https://travis-ci.org/lancetw/react-isomorphic-bundle)
[![Dependency Status](https://david-dm.org/lancetw/react-isomorphic-bundle.svg)](https://david-dm.org/lancetw/react-isomorphic-bundle)
[![devDependency Status](https://david-dm.org/lancetw/react-isomorphic-bundle/dev-status.svg)](https://david-dm.org/lancetw/react-isomorphic-bundle#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/lancetw/react-isomorphic-bundle/badge.svg?branch=master)](https://coveralls.io/r/lancetw/react-isomorphic-bundle?branch=master)
[![Code Climate](https://codeclimate.com/github/lancetw/react-isomorphic-bundle/badges/gpa.svg)](https://codeclimate.com/github/lancetw/react-isomorphic-bundle)

=================

Learning from [isomorphic-flux-boilerplate](https://github.com/iam4x/isomorphic-flux-boilerplate) but use [Redux](https://github.com/gaearon/redux).

## DEMO

Demo site (iisnode): [eventtest.oursweb.net](http://eventtest.oursweb.net)

### Installation

```bash
$ npm uninstall -g babel #completely remove babel@5
$ npm install -g nodemon webpack babel-cli node-inspector
$ npm install
```

edit `./config/sequelize/config.json`

change `dialect` from "postgres" to "sqlite" if you want a simple start.

```bash
$ npm install sqlite3
```

##### DEVELOPMENT

`npm run dev` (*wait until the terminal shows: "webpack: bundle is now VALID".*)

**Press "Ctrl + h" to switch redux devtools**

* open `http://127.0.0.1:3000`

##### PRODUCTION

###### Build and run

* Linux / Mac
`npm start`

* Windows (Git Bash)
`npm run prestart && NODE_ENV=production npm run win-start`

###### Manual build

`make build`
or `make clean && make fast-build` (clean up and rebuild all)

##### DEBUG

`npm run debug`

* open `http://127.0.0.1:8080/debug?ws=127.0.0.1:8080&port=5858`
* open `http://127.0.0.1:3000`

## Features

- [x] based on React 0.14.*
- [x] universal(isomorphic), supported JSON Web Tokens (JWT) and Sessions (levelDB)
- [x] change flummox to redux
- [x] react-router@1.0.0
- [x] register (with recaptcha)
- [x] log in
- [x] Facebook sign in
- [x] Google OAuth sign in
- [x] restful API with JSON Web Tokens
- [x] change password
- [x] create posts
- [x] modify posts
- [x] delete posts
- [x] i18n / language switcher
- [x] Traditional Chinese and Simplified Chinese Conversion (New Tong Wen Tang)
- [x] files/images uploader (dropzone)
- [x] advertisement scripts support
- [x] Google maps with HTML5 Geolocation
- [x] Google maps with driving directions
- [x] post list with infinite scroll (use requestAnimationFrame)
- [x] post list with calendar
- [x] serverside async data-fetching (great thanks to [universal-redux-boilerplate](https://github.com/savemysmartphone/universal-redux-boilerplate))
- [x] simple full text Search
- [x] image slider
- [x] admin pages (manage posts and users)
- [x] nearby map (PostGIS)
- [x] RSS Feed (Atom)
- [x] sitemap
- [x] Google Analytics
- [x] social network share buttons

## You might be interested in...

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
* [passport](https://github.com/jaredhanson/passport)
* [passport-facebook](https://github.com/jaredhanson/passport-facebook)
* [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth)
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
* [react-google-recaptcha](https://github.com/dozoisch/react-google-recaptcha)
* [新同文堂 for Web](http://tongwen.openfoundry.org)
* [react-spinkit](https://github.com/KyleAMathews/react-spinkit)
* [react-helmet](https://github.com/nfl/react-helmet)
* [react-burger-menu](http://negomi.github.io/react-burger-menu/)
* [animation-frame](https://github.com/kof/animation-frame)
* [react-ga](https://github.com/react-ga/react-ga)
* [react-share](https://github.com/nygardk/react-share)
* [react-router-sitemap](https://github.com/kuflash/react-router-sitemap)
