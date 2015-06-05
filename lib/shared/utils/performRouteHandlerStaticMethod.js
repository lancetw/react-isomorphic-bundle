/**
 * Accepts an array of matched routes as returned from react-router's
 * `Router.run()` and calls the given static method on each. The methods may
 * return a promise.
 *
 * Returns a promise that resolves after any promises returned by the routes
 * resolve. The practical uptake is that you can wait for your data to be
 * fetched before continuing. Based off react-router's async-data example
 * https://github.com/rackt/react-router/blob/master/examples/async-data/app.js#L121
 * @param {array} routes - Matched routes
 * @param {string} methodName - Name of static method to call
 * @param {...any} ...args - Arguments to pass to the static method
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function callee$0$0(routes, methodName) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        return context$1$0.abrupt('return', Promise.all(routes.map(function (route) {
          return route.handler[methodName];
        }).filter(function (method) {
          return typeof method === 'function';
        }).map(function (method) {
          return method.apply(undefined, args);
        })));

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

module.exports = exports['default'];
