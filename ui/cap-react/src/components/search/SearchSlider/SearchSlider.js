import React from "react";
import PropTypes from "prop-types";
import Slider from "../../partials/RangeSlider/Slider";
import Box from "grommet/components/Box";

const SearchSlider = ({ items, category }) => {
  return (
    <Box>
      <Slider items={items} category={category} />
    </Box>
  );
};

SearchSlider.propTypes = {
  items: PropTypes.object,
  category: PropTypes.strings
};

export default SearchSlider;
