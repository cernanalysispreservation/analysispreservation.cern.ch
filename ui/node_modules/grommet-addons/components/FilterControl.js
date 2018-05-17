'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _Box = require('grommet/components/Box');

var _Box2 = _interopRequireDefault(_Box);

var _Label = require('grommet/components/Label');

var _Label2 = _interopRequireDefault(_Label);

var _Button = require('grommet/components/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Filter = require('grommet/components/icons/base/Filter');

var _Filter2 = _interopRequireDefault(_Filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

var FilterControl = function (_Component) {
  (0, _inherits3.default)(FilterControl, _Component);

  function FilterControl() {
    (0, _classCallCheck3.default)(this, FilterControl);
    return (0, _possibleConstructorReturn3.default)(this, (FilterControl.__proto__ || (0, _getPrototypeOf2.default)(FilterControl)).apply(this, arguments));
  }

  (0, _createClass3.default)(FilterControl, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          filteredTotal = _props.filteredTotal,
          onClick = _props.onClick,
          unfilteredTotal = _props.unfilteredTotal;

      var top = unfilteredTotal > 0 ? unfilteredTotal : '.';
      var bottom = unfilteredTotal !== filteredTotal ? filteredTotal : '.';

      return _react2.default.createElement(
        _Button2.default,
        { onClick: onClick },
        _react2.default.createElement(
          _Box2.default,
          { align: 'center', pad: { horizontal: 'small' } },
          _react2.default.createElement(
            _Label2.default,
            { size: 'small' },
            top
          ),
          _react2.default.createElement(_Filter2.default, null),
          _react2.default.createElement(
            _Label2.default,
            { size: 'small' },
            bottom
          )
        )
      );
    }
  }]);
  return FilterControl;
}(_react.Component);

FilterControl.displayName = 'FilterControl';
exports.default = FilterControl;
;

FilterControl.propTypes = {
  filteredTotal: _propTypes2.default.number,
  onClick: _propTypes2.default.func,
  unfilteredTotal: _propTypes2.default.number
};
module.exports = exports['default'];