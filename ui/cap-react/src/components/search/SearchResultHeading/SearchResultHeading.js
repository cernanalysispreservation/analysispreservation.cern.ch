import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

const SearchResultHeading = ({ results = 0 }) => {
  return (
    <Box
      direction="row"
      align="end"
      responsive={false}
      margin={{ bottom: "medium" }}
    >
      <Heading margin="none" tag="h3">
        Results
      </Heading>
      <Heading margin="none" tag="h4" style={{ marginLeft: "10px" }}>
        ({results})
      </Heading>
    </Box>
  );
};

SearchResultHeading.propTypes = {
  results: PropTypes.number,
};

export default SearchResultHeading;
