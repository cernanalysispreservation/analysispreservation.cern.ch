import React from "react";
import SVGIcon from "grommet/components/SVGIcon";
import PropTypes from "prop-types";

const b = ({ size = "medium" }) => (
  <SVGIcon
    version="1.1"
    type="logo"
    a11yTitle="Locations Finder"
    viewBox="0 0 22 22"
    size={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="6" height="22" fill="#444444" />
    <rect x="6" width="16" height="22" fill="#D8D8D8" />
    <rect x="9" y="3" width="10" height="4" fill="#FFFEFE" />
    <rect x="9" y="8" width="10" height="2" fill="#FFFEFE" />
    <rect x="9" y="16" width="10" height="2" fill="#FFFEFE" />
    <rect x="9" y="11" width="10" height="4" fill="#FFFEFE" />
  </SVGIcon>
);

b.propTypes = {
  size: PropTypes.string
};

export default b;
