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

var _Button = require('grommet/components/Button');

var _Button2 = _interopRequireDefault(_Button);

var _Box = require('grommet/components/Box');

var _Box2 = _interopRequireDefault(_Box);

var _Select = require('grommet/components/Select');

var _Select2 = _interopRequireDefault(_Select);

var _LinkDown = require('grommet/components/icons/base/LinkDown');

var _LinkDown2 = _interopRequireDefault(_LinkDown);

var _LinkUp = require('grommet/components/icons/base/LinkUp');

var _LinkUp2 = _interopRequireDefault(_LinkUp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sort = function (_Component) {
  (0, _inherits3.default)(Sort, _Component);

  function Sort(props) {
    (0, _classCallCheck3.default)(this, Sort);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Sort.__proto__ || (0, _getPrototypeOf2.default)(Sort)).call(this, props));

    _this._onChange = _this._onChange.bind(_this);
    _this._onChangeDirection = _this._onChangeDirection.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Sort, [{
    key: '_onChange',
    value: function _onChange(event) {
      var _props = this.props,
          direction = _props.direction,
          onChange = _props.onChange;

      var value = event.option.value;
      var nextDirection = event.option.direction || direction || 'desc';
      onChange({ value: value, direction: nextDirection });
    }
  }, {
    key: '_onChangeDirection',
    value: function _onChangeDirection(direction) {
      var _props2 = this.props,
          onChange = _props2.onChange,
          value = _props2.value;

      onChange({ value: value, direction: direction });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          options = _props3.options,
          value = _props3.value,
          direction = _props3.direction,
          props = (0, _objectWithoutProperties3.default)(_props3, ['options', 'value', 'direction']);


      var selectedOption = void 0;
      if (value) {
        selectedOption = options.filter(function (option) {
          return option.value === value;
        })[0];
      }

      return _react2.default.createElement(
        _Box2.default,
        (0, _extends3.default)({}, props, { direction: 'row', justify: 'start', align: 'center',
          responsive: false }),
        _react2.default.createElement(_Select2.default, { value: selectedOption, options: options,
          onChange: this._onChange }),
        _react2.default.createElement(
          _Box2.default,
          { direction: 'row', flex: false, responsive: false, align: 'center' },
          _react2.default.createElement(_Button2.default, {
            icon: _react2.default.createElement(_LinkDown2.default, {
              colorIndex: direction === 'asc' ? 'brand' : undefined }),
            onClick: this._onChangeDirection.bind(this, 'asc') }),
          _react2.default.createElement(_Button2.default, {
            icon: _react2.default.createElement(_LinkUp2.default, {
              colorIndex: direction === 'desc' ? 'brand' : undefined }),
            onClick: this._onChangeDirection.bind(this, 'desc') })
        )
      );
    }
  }]);
  return Sort;
}(_react.Component); // (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

Sort.displayName = 'Sort';
exports.default = Sort;


Sort.propTypes = {
  direction: _propTypes2.default.oneOf(['asc', 'desc']),
  onChange: _propTypes2.default.func, // { value: , direction: }
  options: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    direction: _propTypes2.default.oneOf(['asc', 'desc']),
    label: _propTypes2.default.string,
    value: _propTypes2.default.string.isRequired
  })).isRequired,
  value: _propTypes2.default.string
};
module.exports = exports['default'];