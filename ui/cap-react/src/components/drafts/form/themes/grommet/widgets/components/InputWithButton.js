import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

const InputWithButton = ({ input, buttons }) => (
  <Box flex={false} key="input">
    <Box
      flex={true}
      direction="row"
      wrap={false}
      className="cap-grommet-input"
      responsive={false}
    >
      <Box flex={true}>{input}</Box>
      {buttons}
    </Box>
  </Box>
);

InputWithButton.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  placeholder: PropTypes.string,
  formData: PropTypes.object,
  formDataChange: PropTypes.func,
  pad: PropTypes.string,
  readonly: PropTypes.bool,
  autofocus: PropTypes.bool,
  input: PropTypes.node,
  buttons: PropTypes.oneOf([PropTypes.func, PropTypes.node]),
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func
};

export default InputWithButton;
