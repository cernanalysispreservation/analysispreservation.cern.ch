import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";

import Select from "grommet/components/Select";

const SelectWidget = function(props) {
  // TOFIX onBlur, onFocus
  let _onChange = function _onChange(value) {
    let _value = value.value.value;
    return props.onChange(_value);
  };

  return !props.readonly ? (
    <Select
      placeHolder="Choose from list"
      inline={props.options.inline ? true : false}
      multiple={props.options.multiple ? true : false}
      options={props.readonly ? null : props.options.enumOptions}
      value={props.value}
      onBlur={props.onBlur}
      onChange={_onChange}
      style={{ height: "3.4em" }}
    />
  ) : (
    <Box>
      <Paragraph>
        {`Selected Value: ${props.value || "user inserted no value"}`}
      </Paragraph>
    </Box>
  );
};

SelectWidget.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool
};

export default SelectWidget;
