'use strict';

import koa from 'koa';
import debug from 'debug';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import session from 'koa-session';
import staticCache from 'koa-static-cache';
import path from 'path';
const app = koa();
const env = process.env.NODE_ENV || 'development';
export default app;

// add header `X-Response-Time`
app.use(responseTime());
app.use(logger());

// various security headers
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
  // set debug env, must be programmaticaly for windows
  debug.enable('dev,koa');
  // log when process is blocked
  require('blocked')((ms) => debug('koa')(`blocked for ${ms}ms`));
}

const cacheOpts: Object = {maxAge: 86400000, gzip: true};

// Proxy asset folder to webpack development server in development mode
if (env === 'development') {
  const webpackConfig: Object = require('config/webpack/development.config');
  app.use(mount('/assets', require('koa-proxy')({host: 'http://0.0.0.0:3000'})));
}
else {
  app.use(mount('/assets', staticCache(path.join(__dirname, '../../public/assets'), cacheOpts)));
}

app.keys = ['GOD\'S IN HIS HEAVEN, ALL\'S RIGHT WITH THE WORLD.'];
app.use(session(app));

import appView from './appView';
appView(app);

// Start listening
const port = process.env.PORT || 3000;
app.listen(port);
debug('*')(`App started listening on port ${port}`);
