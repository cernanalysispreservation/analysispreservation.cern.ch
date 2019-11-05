import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

const SwitchWidget = function(props) {
  return (
    <Box
      pad={{ horizontal: "medium" }}
      style={{ overflow: "hidden" }}
      justify="center"
      size={{ width: "xxlarge" }}
      flex={false}
      alignSelf="end"
    >
      {props.value ? "Yes" : "No"}
    </Box>
  );
};

SwitchWidget.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  rawErrors: PropTypes.object,
  schema: PropTypes.object
};

export default SwitchWidget;
