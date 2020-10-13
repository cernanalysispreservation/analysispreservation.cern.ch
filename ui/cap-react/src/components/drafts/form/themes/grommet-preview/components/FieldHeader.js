import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

let FieldHeader = function(props) {
  return props.title ? (
    <Box flex={!props.notFlex} style={{ overflow: "hidden" }}>
      <Label
        size="small"
        // uppercase={true}
        style={{
          fontWeight: props.bold ? 600 : 300,
          fontStyle: props.italic ? "italic" : "normal"
        }}
      >
        {props.title}
      </Label>
    </Box>
  ) : null;
};

FieldHeader.propTypes = {
  title: PropTypes.string
};

export default FieldHeader;
