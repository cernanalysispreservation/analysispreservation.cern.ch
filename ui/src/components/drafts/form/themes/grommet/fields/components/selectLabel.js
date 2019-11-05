import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

const SelectLabel = (icon, name) => {
  return (
    <Box
      flex={false}
      direction="row"
      pad={{ horizontal: "small", between: "small" }}
    >
      <Box>{icon} </Box>
      <Box>{name}</Box>
    </Box>
  );
};

SelectLabel.propTypes = {
  icon: PropTypes.element,
  name: PropTypes.string
};

export default SelectLabel;
