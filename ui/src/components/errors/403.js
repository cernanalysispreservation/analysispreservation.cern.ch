import React from "react";
import Box from "grommet/components/Box";
import Label from "grommet/components/Button";
import Anchor from "grommet/components/Anchor";
import FormPreviousLinkIcon from "grommet/components/icons/base/FormPreviousLink";
import PropTypes from "prop-types";

const PermissionDenied = props => {
  return (
    <Box flex>
      <Box
        fill
        flex
        colorIndex="light-2"
        justify="center"
        align="center"
      >
        <Label>
          {props.status} {props.statusText}
        </Label>
        <span>{props.message}</span>
        <Anchor
          icon={<FormPreviousLinkIcon />}
          label="Go back to dashboard"
          path="/"
          size="small"
        />
    </Box>
    </Box>
  );
};

PermissionDenied.propTypes = {
  status: PropTypes.number,
  message: PropTypes.string
};

export default PermissionDenied;
