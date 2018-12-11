import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import RevertIcon from "grommet/components/icons/base/Revert";

const Suggestions = props => {
  return (
    <Box direction="row" flex={false} justify="between">
      <Box flex={true} size="small">
        <Label size="small" truncate={true}>
          {props.query || ""}
        </Label>
      </Box>
      <Box
        flex={false}
        colorIndex="grey-3"
        pad={{ horizontal: "small" }}
        size={{ width: "small" }}
      >
        <Label size="small" align="center">
          <RevertIcon size="xsmall" /> Search in {props.text}
        </Label>
      </Box>
    </Box>
  );
};

Suggestions.propTypes = {
  query: PropTypes.string,
  text: PropTypes.string
};

export default Suggestions;
