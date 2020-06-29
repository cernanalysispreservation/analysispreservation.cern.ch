import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import RadioButton from "grommet/components/RadioButton";

const RadioWidget = function(props) {
  let { onChange, options, value } = props;
  let { type } = props.schema;
  // TOFIX onBlur, onFocus
  let _onChange = function _onChange(_ref) {
    let _value = _ref.currentTarget.value;

    if (props.schema.type == "boolean") {
      if (["true", "false", true, false].indexOf(_value) > -1)
        _value = _value == "true" ? true : _value == "false" ? false : _value;
      props.onChange(_value);
      return;
    }

    return onChange(value === "" ? options.emptyValue : _value);
  };

  let _optionSelected = option => {
    if (props.value || props.value === false || props.value === 0) {
      if (type == "array" || (type == "string" && props.value.indexOf)) {
        return props.value.indexOf(option) > -1;
      } else {
        return props.value == option || props.value === option;
      }
    }
    return false;
  };

  return (
    <Box direction="row" pad={{ horizontal: "medium" }} flex={false}>
      {options.enumOptions.length > 0
        ? options.enumOptions.map(item => (
            <RadioButton
              disabled={props.readonly}
              key={props.id + item.value}
              id={props.id + item.value}
              name={props.id + item.value}
              label={item.label}
              value={`${item.value}`}
              checked={_optionSelected(item.value)}
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
  readonly: PropTypes.bool,
  schema: PropTypes.object,
  id: PropTypes.string
};

export default RadioWidget;
