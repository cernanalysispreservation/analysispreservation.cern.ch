import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
// import RadioButton from "grommet/components/RadioButton";

const RadioWidget = function(props) {
  let { value } = props;

  return (
    <Box direction="row" pad={{ horizontal: "medium" }} flex={false}>
      {value || "Not answered"}
    </Box>
  );
};

RadioWidget.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  value: PropTypes.string
};

export default RadioWidget;
