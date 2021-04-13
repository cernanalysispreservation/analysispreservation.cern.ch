import React from "react";
import PropTypes from "prop-types";
import Slider from "../../partials/RangeSlider/Slider";

const SearchSlider = ({ item, category }) => {
  return <Slider item={item} category={category} />;
};

SearchSlider.propTypes = {
  item: PropTypes.object,
  category: PropTypes.strings
};

export default SearchSlider;
