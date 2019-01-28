import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

let FieldHeader = function(props) {
  return props.title ? (
    <Box flex={true} style={{ overflow: "hidden" }}>
      <Label size="small" uppercase={true}>
        {props.title}
      </Label>
    </Box>
  ) : null;
};

FieldHeader.propTypes = {
  title: PropTypes.string
};

export default FieldHeader;
