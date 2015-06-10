'use strict';

import koa from 'koa';
import debug from 'debug';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import session from 'koa-session';
import staticCache from 'koa-static-cache';
import cors from 'koa-cors';
import basicAuth from './passport/basic';
import jwtAuth from './passport/local-jwt';
import facebookAuth from './passport/facebook';
import router from './routes';
import path from 'path';
import co from 'co';
import services from 'src/server/services';
import models from 'src/server/db/models';

const app = koa();
const env = process.env.NODE_ENV || 'development';

app.use(responseTime());
app.use(logger());
app.use(helmet.defaults());

if (env === 'production') {
  app.use(require('koa-conditional-get')());
  app.use(require('koa-etag')());
  app.use(require('koa-compressor')());

  // Cache pages
  const cache = require('lru-cache')({maxAge: 3000});
  app.use(require('koa-cash')({
    get: function* (key) {
      return cache.get(key);
    },
    set: function* (key, value) {
      cache.set(key, value);
    }
  }));
}

if (env === 'development') {
  debug.enable('dev,koa');
  require('blocked')((ms) => debug('koa')(`blocked for ${ms}ms`));
}

const cacheOpts: Object = {maxAge: 86400000, gzip: true};

if (env === 'development') {
  const webpackConfig: Object = require('config/webpack/development.config');
  app.use(mount('/assets', require('koa-proxy')({host: 'http://0.0.0.0:3000'})));
}
else {
  app.use(mount('/assets', staticCache(path.join(__dirname, '../../public/assets'), cacheOpts)));
}

app.keys = require('config').app.SESSION_KEYS;
app.use(session(app));

app.use(facebookAuth.initialize());
app.use(facebookAuth.session());

app.use(router.routes());

app.use(mount('/api/v1', services.v1));
app.use(mount('/api/v1', cors()));
app.use(mount('/api/v1', basicAuth.initialize()));
app.use(mount('/api/v1', jwtAuth.initialize()));

import appView from './appView';
appView(app);

let port;
if (env === 'test') {
  port = 3009;
} else {
  port = process.env.PORT || 3000;
}

co(function *() {
  var connection = yield models.sequelize.sync();
  if (connection) {
    console.log('tset', port);
    app.listen(port);
    debug('*')(`App started listening on port ${port}`);
  }
});

export default app;
