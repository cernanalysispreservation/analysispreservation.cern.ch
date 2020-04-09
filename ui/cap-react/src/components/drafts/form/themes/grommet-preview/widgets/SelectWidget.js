import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

const SelectWidget = function(props) {
  return (
    <Box
      style={{ overflow: "hidden" }}
      pad={{ horizontal: "medium" }}
      size={{ width: "xxlarge" }}
      justify="center"
      flex={false}
      alignSelf="end"
    >
      {props.value || ""}
    </Box>
  );
};

SelectWidget.propTypes = {
  value: PropTypes.string
};

export default SelectWidget;
