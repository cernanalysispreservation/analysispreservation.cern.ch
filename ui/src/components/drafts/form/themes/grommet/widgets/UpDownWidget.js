import React from "react";
import PropTypes from "prop-types";

import NumberInput from "grommet/components/NumberInput";

const UpDownWidget = function(props) {
  let { onChange, onBlur, options, value } = props;
  // TOFIX onBlur, onFocus
  let _onChange = function _onChange(_ref) {
    let value = _ref.target.value;
    return onChange(value === "" ? options.emptyValue : value);
  };

  return (
    <NumberInput
      disabled={props.readonly}
      id="item1"
      name="item-1"
      step={null}
      min={null}
      max={null}
      onChange={_onChange.bind(this)}
      onBlur={onBlur}
      defaultValue={value}
    />
  );
};

UpDownWidget.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  value: PropTypes.number
};

export default UpDownWidget;
