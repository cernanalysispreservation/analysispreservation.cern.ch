import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import Button from "../../partials/Button";

const Loading = ({ error, retry, timedOut, pastDelay }) => {
  if (error) {
    return (
      <Box>
        There is an error loading component
        <Button text="Retry Loading" primary onClick={retry} />
      </Box>
    );
  }

  if (timedOut) {
    return (
      <Box>
        Loading takes more time
        <Button text="Retry Loading" primary onClick={retry} />
      </Box>
    );
  }

  if (pastDelay) {
    return <Box>Loading...</Box>;
  }

  return null;
};

Loading.propTypes = {
  error: PropTypes.object,
  retry: PropTypes.func,
  timedOut: PropTypes.bool,
  pastDelay: PropTypes.bool
};

export default Loading;
