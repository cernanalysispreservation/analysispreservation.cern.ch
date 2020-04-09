import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import RadioButton from "grommet/components/RadioButton";

const RadioWidget = function(props) {
  let { onChange, options, value } = props;
  // TOFIX onBlur, onFocus
  let _onChange = function _onChange(_ref) {
    let _value = _ref.currentTarget.value;
    return onChange(value === "" ? options.emptyValue : _value);
  };

  return (
    <Box direction="row" pad={{ horizontal: "medium" }} flex={false}>
      {options.enumOptions.length > 0
        ? options.enumOptions.map(item => (
            <RadioButton
              disabled={props.readonly}
              key={item.value}
              id={item.value}
              name={item.label}
              label={item.value}
              value={item.value}
              checked={value == item.value}
              onChange={_onChange}
            />
          ))
        : null}
    </Box>
  );
};

RadioWidget.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  value: PropTypes.string,
  readonly: PropTypes.bool
};

export default RadioWidget;
