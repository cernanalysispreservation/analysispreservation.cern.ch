import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import CheckBox from "grommet/components/CheckBox";

const SwitchWidget = function(props) {
  // TOFIX onBlur, onFocus
  let _onChange = event => {
    if (event.target.checked) {
      props.onChange(true);
    } else {
      props.onChange(undefined);
    }
  };

  // let _errors = null;
  // if (props.rawErrors && props.rawErrors.length > 0)
  //   _errors = props.rawErrors.map((error, index) => <span key={index}>{error}</span>);

  return (
    <Box margin={{ top: "small" }}>
      <CheckBox
        key={props.id}
        toggle={true}
        disabled={true}
        name={props.id}
        checked={props.value}
        onChange={_onChange}
      />
    </Box>
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
