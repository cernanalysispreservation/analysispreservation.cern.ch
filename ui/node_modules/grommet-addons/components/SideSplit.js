'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Split = require('grommet/components/Split');

var _Split2 = _interopRequireDefault(_Split);

var _Button = require('grommet/components/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Close = require('grommet/components/icons/base/Close');

var _Close2 = _interopRequireDefault(_Close);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SideSplit = function (_Component) {
  (0, _inherits3.default)(SideSplit, _Component);

  function SideSplit() {
    (0, _classCallCheck3.default)(this, SideSplit);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SideSplit.__proto__ || (0, _getPrototypeOf2.default)(SideSplit)).call(this));

    _this.state = { responsive: 'multiple' };
    return _this;
  }

  (0, _createClass3.default)(SideSplit, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          active = _props.active,
          children = _props.children,
          props = (0, _objectWithoutProperties3.default)(_props, ['active', 'children']);
      var responsive = this.state.responsive;

      var priority = active && 'single' === responsive ? 'left' : 'right';
      return _react2.default.createElement(
        _Split2.default,
        (0, _extends3.default)({}, props, { priority: priority, flex: 'right',
          onResponsive: function onResponsive(mode) {
            return _this2.setState({ responsive: mode });
          } }),
        children
      );
    }
  }]);
  return SideSplit;
}(_react.Component); // (C) Copyright 2016 Hewlett Packard Enterprise Development LP

SideSplit.displayName = 'SideSplit';
exports.default = SideSplit;
;

SideSplit.propTypes = {
  active: _propTypes2.default.bool,
  logo: _propTypes2.default.node
};

SideSplit.SideCloser = function (props) {
  return _react2.default.createElement(_Button2.default, (0, _extends3.default)({ a11yTitle: 'Close Menu' }, props, { icon: _react2.default.createElement(_Close2.default, null) }));
};

SideSplit.SideOpener = function (props) {
  var active = props.active,
      restProps = (0, _objectWithoutProperties3.default)(props, ['active']);

  if (active) {
    return _react2.default.createElement(
      _Button2.default,
      (0, _extends3.default)({ a11yTitle: 'Open Menu' }, restProps, { plain: true }),
      props.children
    );
  } else {
    return _react2.default.createElement('span', null);
  }
};
module.exports = exports['default'];