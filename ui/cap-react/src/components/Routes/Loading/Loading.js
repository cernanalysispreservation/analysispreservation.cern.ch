import React from "react";
import PropTypes from "prop-types";

import Spinning from "grommet/components/icons/Spinning";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";

const Loader = ({ error, pastDelay, retry }) => {
  if (pastDelay) {
    return (
      <Box flex full align="center" justify="center">
        <Spinning size="large" />
      </Box>
    );
  } else if (error) {
    return (
      <Box flex full align="center" justify="center">
        <Button label="Reload" onClick={retry} />
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
