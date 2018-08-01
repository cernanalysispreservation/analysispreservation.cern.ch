import React from "react";
import PropTypes from "prop-types";

import { Box, Select } from "grommet";

const SelectWidget = function(props) {
  // TOFIX onBlur, onFocus
  let _onChange = function _onChange(value) {
    let _value = value.value.value;
    return props.onChange(_value);
  };

  return (
    <Box
      flex={true}
      pad={{ vertical: "small" }}
      margin={{ bottom: "small", left: "medium" }}
    >
      <Select
        placeHolder={props.placeholder}
        inline={props.options.inline ? true : false}
        multiple={props.options.multiple ? true : false}
        options={props.options.enumOptions}
        value={props.value}
        onBlur={props.onBlur}
        onChange={_onChange}
      />
    </Box>
  );
};

SelectWidget.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  placeholder: PropTypes.string
};

export default SelectWidget;
