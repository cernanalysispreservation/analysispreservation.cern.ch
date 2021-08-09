import React from "react";
import PropTypes from "prop-types";
import Error from "../../img/error.svg";
import { Box, Label } from "grommet";

const ErrorScreen = ({
  icon = null,
  message = "There was an error, please try again"
}) => {
  return (
    <Box flex align="center" justify="center">
      {icon ? icon : <Error />}
      <Label>{message}</Label>
    </Box>
  );
};

ErrorScreen.propTypes = {
  message: PropTypes.array,
  icon: PropTypes.element
};

export default ErrorScreen;
