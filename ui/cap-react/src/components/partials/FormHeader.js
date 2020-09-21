import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

const FormHeader = ({
  title = "Untitled",
  tags = null,
  editAnchor = null,
  reviewAnchor = null
}) => {
  return (
    <Box>
      <Box
        direction="row"
        justify="between"
        align="center"
        pad={{ vertical: "small", horizontal: "medium" }}
        separator="bottom"
        margin={{ bottom: "medium" }}
        responsive={false}
      >
        <Box flex direction="row" align="center" justify="start" >
          <Heading tag="h3" margin="none" style={{ marginRight: "12px", fontStyle: "italic" }}>
            {title}
          </Heading>
          {tags}
        </Box>

        <Box direction="row">
          {editAnchor}
          {reviewAnchor}
        </Box>
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
