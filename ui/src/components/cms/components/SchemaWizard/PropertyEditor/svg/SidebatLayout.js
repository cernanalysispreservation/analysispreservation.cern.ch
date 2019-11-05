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
    <rect width="6" height="22" fill="#444444" />
    <rect x="6" width="16" height="22" fill="#D8D8D8" />
    <rect x="7.45459" y="2" width="5.81818" height="5" fill="#FFFEFE" />
    <rect x="7.45459" y="8" width="5.81818" height="4" fill="#FFFEFE" />
    <rect x="14.7271" y="8" width="5.81818" height="6" fill="#FFFEFE" />
    <rect x="14.7271" y="2" width="5.81818" height="4" fill="#FFFEFE" />
    <rect x="7.45459" y="13" width="5.81818" height="2" fill="#FFFEFE" />
    <rect x="14.7271" y="16" width="5.81818" height="2" fill="#FFFEFE" />
  </SVGIcon>
);

b.propTypes = {
  size: PropTypes.string
};
export default b;
