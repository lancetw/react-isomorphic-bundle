'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _reactRouter2 = _interopRequireDefault(_reactRouter);

var _flummoxComponent = require('flummox/component');

var _flummoxComponent2 = _interopRequireDefault(_flummoxComponent);

var _sharedFlux = require('../shared/Flux');

var _sharedFlux2 = _interopRequireDefault(_sharedFlux);

var _sharedRoutes = require('../shared/routes');

var _sharedRoutes2 = _interopRequireDefault(_sharedRoutes);

var _sharedUtilsPerformRouteHandlerStaticMethod = require('../shared/utils/performRouteHandlerStaticMethod');

var _sharedUtilsPerformRouteHandlerStaticMethod2 = _interopRequireDefault(_sharedUtilsPerformRouteHandlerStaticMethod);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

_nunjucks2['default'].configure('views', {
  autoescape: true
});

exports['default'] = function (app) {
  app.use(regeneratorRuntime.mark(function callee$1$0() {
    var router, flux, appString, assets, _ref, Handler, state, routeHandlerInfo, env;

    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          router = _reactRouter2['default'].create({
            routes: _sharedRoutes2['default'],
            location: this.url,
            onError: function onError(error) {
              throw error;
            },
            onAbort: function onAbort(abortReason) {
              var error = new Error();

              if (abortReason.constructor.name === 'Redirect') {
                var to = abortReason.to;
                var params = abortReason.params;
                var query = abortReason.query;

                var url = router.makePath(to, params, query);
                error.redirect = url;
              }

              throw error;
            }
          });
          flux = new _sharedFlux2['default']();
          appString = undefined, assets = undefined;
          context$2$0.prev = 3;
          context$2$0.next = 6;
          return new Promise(function (resolve, reject) {
            router.run(function (_Handler, _state) {
              return resolve({ Handler: _Handler, state: _state });
            });
          });

        case 6:
          _ref = context$2$0.sent;
          Handler = _ref.Handler;
          state = _ref.state;
          routeHandlerInfo = { state: state, flux: flux };
          context$2$0.prev = 10;
          context$2$0.next = 13;
          return (0, _sharedUtilsPerformRouteHandlerStaticMethod2['default'])(state.routes, 'routerWillRun', routeHandlerInfo);

        case 13:
          context$2$0.next = 17;
          break;

        case 15:
          context$2$0.prev = 15;
          context$2$0.t0 = context$2$0['catch'](10);

        case 17:
          env = process.env.NODE_ENV;

          if (env === 'development') {
            console.log(_path2['default'].resolve(__dirname, './webpack-stats.json'));
            assets = _fs2['default'].readFileSync(_path2['default'].resolve(__dirname, './webpack-stats.json'));
            assets = JSON.parse(assets);
          } else {
            assets = require('./webpack-stats.json');
          }

          appString = _react2['default'].renderToString(_react2['default'].createElement(
            _flummoxComponent2['default'],
            { flux: flux },
            _react2['default'].createElement(Handler, state)
          ));
          context$2$0.next = 27;
          break;

        case 22:
          context$2$0.prev = 22;
          context$2$0.t1 = context$2$0['catch'](3);

          if (!context$2$0.t1.redirect) {
            context$2$0.next = 26;
            break;
          }

          return context$2$0.abrupt('return', this.redirect(context$2$0.t1.redirect));

        case 26:
          throw context$2$0.t1;

        case 27:

          this.body = _nunjucks2['default'].render('index.html', {
            appString: appString,
            assets: assets,
            env: process.env
          });

        case 28:
        case 'end':
          return context$2$0.stop();
      }
    }, callee$1$0, this, [[3, 22], [10, 15]]);
  }));
};

module.exports = exports['default'];