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
    <rect y="2" width="22" height="20" fill="#D8D8D8" />
    <rect x="2" y="3.81818" width="8" height="4.54545" fill="#FFFEFE" />
    <rect x="2" y="9.27273" width="8" height="3.63636" fill="#FFFEFE" />
    <rect x="12" y="9.27273" width="8" height="5.45455" fill="#FFFEFE" />
    <rect x="12" y="3.81818" width="8" height="3.63636" fill="#FFFEFE" />
    <rect x="2" y="13.8182" width="8" height="1.81818" fill="#FFFEFE" />
    <rect x="12" y="16.5455" width="8" height="1.81818" fill="#FFFEFE" />
    <rect width="22" height="2" fill="#444444" />
  </SVGIcon>
);

b.propTypes = {
  size: PropTypes.string
};

export default b;
