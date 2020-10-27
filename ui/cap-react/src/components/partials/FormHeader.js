import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

const FormHeader = ({
  title = "Untitled",
  tags = null,
  editAnchor = null,
  reviewAnchor = null,
  showFiles = null
}) => {
  return (
    <Box pad="small" separator="bottom" direction="row" justify="between">
      <Box className="center-small">
        <Heading
          tag="h3"
          margin="none"
          style={{ fontStyle: "italic", marginRight: "5px" }}
        >
          {title}
        </Heading>
        <Box margin={{ top: "small" }}>{tags}</Box>
      </Box>

      <Box justify="between" className="button-align mt-small">
        <Box direction="row" responsive={false}>
          {editAnchor}
          {reviewAnchor}
        </Box>
        {showFiles}
      </Box>
    </Box>
  );
};

FormHeader.propTypes = {
  title: PropTypes.string,
  tags: PropTypes.element,
  editAnchor: PropTypes.element,
  reviewAnchor: PropTypes.element
};

export default FormHeader;
