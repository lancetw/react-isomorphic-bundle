'use strict';

var _this = this;

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

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

if (process.env.NODE_ENV === 'development') {
  // Warns about potential accessibility issues with your React elements
  require('react-a11y')(_react2['default']);
  require('debug').enable('dev,koa');
}

var flux = new _sharedFlux2['default']();

var router = _reactRouter2['default'].create({
  routes: _sharedRoutes2['default'],
  location: _reactRouter2['default'].HistoryLocation
});

// Render app
router.run(function callee$0$0(Handler, state) {
  var routeHandlerInfo;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        routeHandlerInfo = { state: state, flux: flux };
        context$1$0.next = 3;
        return regeneratorRuntime.awrap((0, _sharedUtilsPerformRouteHandlerStaticMethod2['default'])(state.routes, 'routerWillRun', routeHandlerInfo));

      case 3:

        _react2['default'].render(_react2['default'].createElement(
          _flummoxComponent2['default'],
          { flux: flux },
          _react2['default'].createElement(Handler, state)
        ), document.getElementById('app'));

      case 4:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
});

// Intercept local route changes
document.onclick = function (event) {
  var target = event.toElement;

  if (!target) return;

  if (target.tagName !== 'A') return;

  var href = target.getAttribute('href');

  if (!href) return;

  var resolvedHref = _url2['default'].resolve(window.location.href, href);

  var _url$parse = _url2['default'].parse(resolvedHref);

  var host = _url$parse.host;
  var path = _url$parse.path;

  if (host === window.location.host) {
    event.preventDefault();
    router.transitionTo(path);
  }
};