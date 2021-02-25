import React from "react";
import PropTypes from "prop-types";

import CheckBox from "grommet/components/CheckBox";

const SwitchWidget = function(props) {
  // TOFIX onBlur, onFocus
  let _onChange = event => {
    let value = event.target.checked;

    // in case the type is string
    if (props.schema.type === "string") value = String(event.target.checked);

    // in case the type is number
    if (props.schema.type === "number") value = event.target.checked ? 1 : 0;

    // in case the false value needs to be undefined
    value =
      !event.target.checked && props.options && props.options.falseToUndefined
        ? undefined
        : value;

    props.onChange(value);
  };

  // let _errors = null;
  // if (props.rawErrors && props.rawErrors.length > 0)
  //   _errors = props.rawErrors.map((error, index) => <span key={index}>{error}</span>);
  return (
    <CheckBox
      disabled={props.readonly}
      key={props.id}
      toggle={true}
      name={props.id}
      onChange={_onChange}
      checked={
        props.schema.type === "string" ? props.value === "true" : props.value
      }
    />
  );
};

SwitchWidget.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  rawErrors: PropTypes.object,
  schema: PropTypes.object,
  readonly: PropTypes.bool,
  formData: PropTypes.string
};

export default SwitchWidget;
