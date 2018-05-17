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

var _Spinning = require('grommet/components/icons/Spinning');

var _Spinning2 = _interopRequireDefault(_Spinning);

var _FormattedMessage = require('grommet/components/FormattedMessage');

var _FormattedMessage2 = _interopRequireDefault(_FormattedMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListPlaceholder = function (_Component) {
  (0, _inherits3.default)(ListPlaceholder, _Component);

  function ListPlaceholder() {
    (0, _classCallCheck3.default)(this, ListPlaceholder);
    return (0, _possibleConstructorReturn3.default)(this, (ListPlaceholder.__proto__ || (0, _getPrototypeOf2.default)(ListPlaceholder)).apply(this, arguments));
  }

  (0, _createClass3.default)(ListPlaceholder, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          addControl = _props.addControl,
          emptyMessage = _props.emptyMessage,
          filteredTotal = _props.filteredTotal,
          unfilteredTotal = _props.unfilteredTotal;


      var content1 = void 0,
          content2 = void 0;
      if (unfilteredTotal === 0) {
        content1 = _react2.default.createElement(
          'span',
          { className: 'secondary' },
          emptyMessage
        );
        content2 = addControl;
      } else if (filteredTotal === 0) {
        content1 = _react2.default.createElement(
          'span',
          { className: 'secondary' },
          _react2.default.createElement(_FormattedMessage2.default, { id: 'No matches', defaultMessage: 'No matches' })
        );
      } else if (!filteredTotal) {
        content1 = _react2.default.createElement(_Spinning2.default, null);
      }
      if (content1) {
        content1 = _react2.default.createElement(
          _Box2.default,
          { justify: 'center', align: 'center',
            pad: {
              horizontal: 'medium', vertical: 'large', between: 'medium'
            } },
          content1,
          content2
        );
      }
      return content1 || null;
    }
  }]);
  return ListPlaceholder;
}(_react.Component); // (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

ListPlaceholder.displayName = 'ListPlaceholder';
exports.default = ListPlaceholder;
;

ListPlaceholder.propTypes = {
  addControl: _propTypes2.default.element,
  emptyMessage: _propTypes2.default.string,
  filteredTotal: _propTypes2.default.number,
  unfilteredTotal: _propTypes2.default.number
};

ListPlaceholder.defaultProps = {
  emptyMessage: 'None'
};
module.exports = exports['default'];