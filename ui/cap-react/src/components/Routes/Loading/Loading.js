import React from "react";
import PropTypes from "prop-types";

import Spinning from "grommet/components/icons/Spinning";
import Box from "grommet/components/Box";

const Loader = ({ error, pastDelay, retry }) => {
  if (error) {
    return (
      <Box flex full align="center" justify="center">
        <Box
          onClick={retry}
          pad={{ horizontal: "medium", vertical: "small" }}
          colorIndex="brand"
        >
          Reload
        </Box>
      </Box>
    );
  } else if (pastDelay) {
    return (
      <Box flex full align="center" justify="center">
        <Spinning size="large" />
      </Box>
    );
  } else {
    return null;
  }
};

Loader.propTypes = {
  error: PropTypes.bool,
  pastDelay: PropTypes.bool,
  retry: PropTypes.func
};

export default Loader;
