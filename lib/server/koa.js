'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _koaMount = require('koa-mount');

var _koaMount2 = _interopRequireDefault(_koaMount);

var _koaHelmet = require('koa-helmet');

var _koaHelmet2 = _interopRequireDefault(_koaHelmet);

var _koaLogger = require('koa-logger');

var _koaLogger2 = _interopRequireDefault(_koaLogger);

var _koaResponseTime = require('koa-response-time');

var _koaResponseTime2 = _interopRequireDefault(_koaResponseTime);

var _koaSession = require('koa-session');

var _koaSession2 = _interopRequireDefault(_koaSession);

var _koaStaticCache = require('koa-static-cache');

var _koaStaticCache2 = _interopRequireDefault(_koaStaticCache);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _appView = require('./appView');

var _appView2 = _interopRequireDefault(_appView);

var app = (0, _koa2['default'])();
var env = process.env.NODE_ENV || 'development';
exports['default'] = app;

// add header `X-Response-Time`
app.use((0, _koaResponseTime2['default'])());
app.use((0, _koaLogger2['default'])());

// various security headers
app.use(_koaHelmet2['default'].defaults());

if (env === 'production') {
  (function () {
    app.use(require('koa-conditional-get')());
    app.use(require('koa-etag')());
    app.use(require('koa-compressor')());

    // Cache pages
    var cache = require('lru-cache')({ maxAge: 3000 });
    app.use(require('koa-cash')({
      get: regeneratorRuntime.mark(function get(key) {
        return regeneratorRuntime.wrap(function get$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              return context$2$0.abrupt('return', cache.get(key));

            case 1:
            case 'end':
              return context$2$0.stop();
          }
        }, get, this);
      }),
      set: regeneratorRuntime.mark(function set(key, value) {
        return regeneratorRuntime.wrap(function set$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              cache.set(key, value);

            case 1:
            case 'end':
              return context$2$0.stop();
          }
        }, set, this);
      })
    }));
  })();
}

if (env === 'development') {
  // set debug env, must be programmaticaly for windows
  _debug2['default'].enable('dev,koa');
  // log when process is blocked
  require('blocked')(function (ms) {
    return (0, _debug2['default'])('koa')('blocked for ' + ms + 'ms');
  });
}

var cacheOpts = { maxAge: 86400000, gzip: true };

// Proxy asset folder to webpack development server in development mode
if (env === 'development') {
  var webpackConfig = require('config/webpack/development.config');
  app.use((0, _koaMount2['default'])('/assets', require('koa-proxy')({ host: 'http://0.0.0.0:3000' })));
} else {
  console.log(_path2['default'].join(__dirname, '../../public/assets'));
  app.use((0, _koaMount2['default'])('/assets', (0, _koaStaticCache2['default'])(_path2['default'].join(__dirname, '../../public/assets'), cacheOpts)));
}

app.keys = ['GOD\'S IN HIS HEAVEN, ALL\'S RIGHT WITH THE WORLD.'];
app.use((0, _koaSession2['default'])(app));

(0, _appView2['default'])(app);

// Start listening
var port = process.env.PORT || 3000;
app.listen(port);
console.log('App started listening on port ' + port);
module.exports = exports['default'];