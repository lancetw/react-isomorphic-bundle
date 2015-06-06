'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _reactRouter = require('react-router');

var CSSTransitionGroup = _reactAddons2['default'].addons.CSSTransitionGroup;

if (process.env.BROWSER) {
  require('less/ui');
  require('less/app');
}

var AppHandler = (function (_React$Component) {
  function AppHandler() {
    _classCallCheck(this, AppHandler);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(AppHandler, _React$Component);

  _createClass(AppHandler, [{
    key: 'render',
    value: function render() {
      return _reactAddons2['default'].createElement(
        'div',
        null,
        _reactAddons2['default'].createElement(
          CSSTransitionGroup,
          { transitionName: 'RouteTransition' },
          _reactAddons2['default'].createElement(_reactRouter.RouteHandler, _extends({}, this.props, { key: this.props.pathname }))
        )
      );
    }
  }], [{
    key: 'willTransitionTo',
    value: function willTransitionTo(transition) {
      var path = transition.path;

      if (path !== '/' && path.endsWith('/')) {
        transition.redirect(path.substring(0, path.length - 1));
      }
    }
  }]);

  return AppHandler;
})(_reactAddons2['default'].Component);

exports['default'] = AppHandler;
module.exports = exports['default'];