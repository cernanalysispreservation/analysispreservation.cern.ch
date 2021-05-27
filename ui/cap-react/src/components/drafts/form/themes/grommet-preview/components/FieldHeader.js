import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

let FieldHeader = function(props) {
  return props.title ? (
    <Box flex={true} style={{ overflow: "hidden" }}>
      <span
        size="small"
        style={{
          fontWeight: props.bold ? 600 : 300,
          fontStyle: props.italic ? "italic" : "normal",
          fontSize: "0.875rem",
          lineHeight: 1.71429,
          color: "#666"
        }}
        dangerouslySetInnerHTML={{ __html: props.title }}
      />
    </Box>
  ) : null;
};

FieldHeader.propTypes = {
  title: PropTypes.string,
  bold: PropTypes.bool,
  italic: PropTypes.bool
};

export default FieldHeader;
