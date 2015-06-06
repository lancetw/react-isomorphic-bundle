'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _componentsAppHandler = require('./components/AppHandler');

var _componentsAppHandler2 = _interopRequireDefault(_componentsAppHandler);

var _componentsHomeHandler = require('./components/HomeHandler');

var _componentsHomeHandler2 = _interopRequireDefault(_componentsHomeHandler);

//import DocHandler from './components/DocHandler';

exports['default'] = _react2['default'].createElement(
  _reactRouter.Route,
  { name: 'app', path: '/', handler: _componentsAppHandler2['default'] },
  _react2['default'].createElement(_reactRouter.Route, { name: 'index', path: '/index', handler: _componentsHomeHandler2['default'] }),
  _react2['default'].createElement(_reactRouter.Redirect, { from: '*', to: 'index' })
);
module.exports = exports['default'];