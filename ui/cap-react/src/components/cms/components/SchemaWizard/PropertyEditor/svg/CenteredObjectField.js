import React from "react";
import SVGIcon from "grommet/components/SVGIcon";
import PropTypes from "prop-types";

const b = ({ size = "medium" }) => (
  <SVGIcon
    version="1.1"
    type="logo"
    a11yTitle="Locations Finder"
    size={size}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="22" height="22" fill="#D8D8D8" />
    <rect x="6" y="2.2" width="10" height="4.4" fill="#FFFEFE" />
    <rect x="6" y="7.7" width="10" height="2.2" fill="#FFFEFE" />
    <rect x="6" y="16.5" width="10" height="2.2" fill="#FFFEFE" />
    <rect x="6" y="11" width="10" height="4.4" fill="#FFFEFE" />
  </SVGIcon>
);

b.propTypes = {
  size: PropTypes.string
};

export default b;
