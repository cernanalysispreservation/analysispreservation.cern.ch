import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";

const ReadOnlyText = props => {
  return (
    <Box flex={true} pad={props.pad || { horizontal: "medium" }}>
      <Paragraph size="small" margin="none" style={{ color: "#a8a8a8" }}>
        {props.value || "empty value"}
      </Paragraph>
    </Box>
  );
};

ReadOnlyText.propTypes = {
  pad: PropTypes.string,
  value: PropTypes.string
};

export default ReadOnlyText;
