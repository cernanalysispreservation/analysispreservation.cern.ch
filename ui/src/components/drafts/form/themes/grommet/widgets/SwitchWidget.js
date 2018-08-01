import React from "react";
import PropTypes from "prop-types";

import { CheckBox } from "grommet";

const SwitchWidget = function(props) {
  // TOFIX onBlur, onFocus
  let _onChange = event => {
    if (event.target.checked) {
      props.onChange(props.schema.type == "string" ? "true" : true);
    } else {
      props.onChange(undefined);
    }
  };

  // let _errors = null;
  // if (props.rawErrors && props.rawErrors.length > 0)
  //   _errors = props.rawErrors.map((error, index) => <span key={index}>{error}</span>);

  return (
    <CheckBox
      key={props.id}
      toggle={true}
      name={props.id}
      onChange={_onChange}
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
  schema: PropTypes.object
};

export default SwitchWidget;
