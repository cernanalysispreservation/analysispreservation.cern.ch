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

var _Meter = require('grommet/components/Meter');

var _Meter2 = _interopRequireDefault(_Meter);

var _Box = require('grommet/components/Box');

var _Box2 = _interopRequireDefault(_Box);

var _Value = require('grommet/components/Value');

var _Value2 = _interopRequireDefault(_Value);

var _Legend = require('grommet/components/Legend');

var _Legend2 = _interopRequireDefault(_Legend);

var _FormattedMessage = require('grommet/components/FormattedMessage');

var _FormattedMessage2 = _interopRequireDefault(_FormattedMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Label from 'grommet/components/Label';
var AnnotatedMeter = function (_Component) {
  (0, _inherits3.default)(AnnotatedMeter, _Component);

  function AnnotatedMeter() {
    (0, _classCallCheck3.default)(this, AnnotatedMeter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AnnotatedMeter.__proto__ || (0, _getPrototypeOf2.default)(AnnotatedMeter)).call(this));

    _this._onActive = _this._onActive.bind(_this);
    _this.state = {};
    return _this;
  }

  (0, _createClass3.default)(AnnotatedMeter, [{
    key: '_onActive',
    value: function _onActive(index) {
      var onActive = this.props.onActive;

      this.setState({ index: index });
      if (onActive) {
        onActive(index);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          legend = _props.legend,
          max = _props.max,
          series = _props.series,
          size = _props.size,
          type = _props.type,
          units = _props.units;
      var index = this.state.index;


      var value = void 0,
          label = void 0;
      if (index >= 0) {
        value = series[index].value;
        label = series[index].label;
      } else {
        value = 0;
        series.forEach(function (item) {
          return value += item.value;
        });
        label = _react2.default.createElement(_FormattedMessage2.default, { id: 'Total', defaultMessage: 'Total' });
      }

      var top = void 0,
          middle = void 0,
          bottom = void 0,
          alignMeter = void 0,
          alignLegend = void 0;
      if ('bar' === type) {

        top = _react2.default.createElement(
          _Box2.default,
          { direction: 'row', justify: 'between', align: 'center',
            pad: { between: 'small' }, responsive: false },
          _react2.default.createElement(_Value2.default, { value: value, units: units, align: 'start', size: size }),
          _react2.default.createElement(
            'span',
            null,
            label
          )
        );

        middle = _react2.default.createElement(_Meter2.default, { series: series, stacked: true, label: false, max: max,
          size: size, activeIndex: index,
          onActive: this._onActive });

        alignMeter = 'start';
        alignLegend = 'start';
      } else if ('circle' === type) {

        middle = _react2.default.createElement(_Meter2.default, { type: 'circle', stacked: true, series: series,
          label: _react2.default.createElement(_Value2.default, { value: value, units: units, align: 'center', label: label,
            size: size }), max: max, size: size, activeIndex: index,
          onActive: this._onActive });

        alignMeter = 'center';
        alignLegend = 'center';
      }

      // if (max) {
      //   bottom = (
      //     <Box direction='row' justify='between' align='center'
      //       responsive={false}>
      //       <Label size='small'>0 {units}</Label>
      //       <Label size='small'>{max} {units}</Label>
      //     </Box>
      //   );
      // }

      var legendElement = void 0;
      if (legend) {
        legendElement = _react2.default.createElement(
          _Box2.default,
          { alignSelf: alignLegend },
          _react2.default.createElement(_Legend2.default, { series: series, units: units, total: true,
            activeIndex: index, onActive: this._onActive })
        );
      }

      return _react2.default.createElement(
        _Box2.default,
        { align: 'start' },
        _react2.default.createElement(
          _Box2.default,
          { align: alignMeter },
          top,
          middle,
          bottom,
          legendElement
        )
      );
    }
  }]);
  return AnnotatedMeter;
}(_react.Component); // (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

AnnotatedMeter.displayName = 'AnnotatedMeter';
exports.default = AnnotatedMeter;
;

AnnotatedMeter.propTypes = {
  onActive: _propTypes2.default.func,
  legend: _propTypes2.default.bool,
  max: _propTypes2.default.number,
  series: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    colorIndex: _propTypes2.default.string,
    onClick: _propTypes2.default.func,
    label: _propTypes2.default.string.isRequired,
    value: _propTypes2.default.number.isRequired
  })).isRequired,
  size: _Meter2.default.propTypes.size,
  type: _propTypes2.default.oneOf(['bar', 'circle']).isRequired,
  units: _propTypes2.default.string
};
module.exports = exports['default'];