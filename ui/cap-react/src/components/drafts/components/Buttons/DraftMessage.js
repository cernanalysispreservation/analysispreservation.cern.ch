import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Spinning from "grommet/components/icons/Spinning";

const DraftMessage = ({ message, loading }) => {
  return message ? (
    <Box direction="row" pad={{ horizontal: "small" }} full="horizontal">
      {[
        loading ? (
          <Spinning key="loading-spinner" />
        ) : (
          <Box margin={{ left: "medium" }} />
        ),
        message && (
          <Label size="small" margin="none" uppercase={true}>
            {message.msg.toLowerCase()}
          </Label>
        )
      ]}
    </Box>
  ) : null;
};

DraftMessage.propTypes = {
  message: PropTypes.string,
  loading: PropTypes.bool
};

export default DraftMessage;
