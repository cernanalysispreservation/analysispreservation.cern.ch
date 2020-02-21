import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";

const ReadOnlyText = ({ value, props }) => {
  return (
    <Box flex={true} pad={props.pad || { horizontal: "medium" }}>
      <Paragraph size="small" margin="none" style={{ color: "#a8a8a8" }}>
        {value ||
          `this field value will be automatically loaded when a valid ${props
            .options.parent || "value from a parent"} will be provided`}
      </Paragraph>
    </Box>
  );
};

ReadOnlyText.propTypes = {
  pad: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  props: PropTypes.object
};

export default ReadOnlyText;
