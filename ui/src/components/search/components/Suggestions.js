import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import RevertIcon from "grommet/components/icons/base/Revert";

const Suggestions = props => {
  return (
    <Box
      direction="row"
      color="grey-4"
      flex={false}
      justify="between"
      style={{ marginLeft: "-10px", marginRight: "-10px" }}
    >
      <Box flex={true} size="small">
        <Label size="small" truncate={true}>
          {props.query || ""}
        </Label>
      </Box>
      <Label size="small">
        <RevertIcon size="xsmall" /> Search in {props.text}
      </Label>
    </Box>
  );
};

Suggestions.propTypes = {
  query: PropTypes.string,
  text: PropTypes.string
};

export default Suggestions;
