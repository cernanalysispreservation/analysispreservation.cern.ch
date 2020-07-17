import React from "react";
import PropTypes from "prop-types";
import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";

const Anchors = ({
  label = null,
  icon = null,
  primary = false,
  onClick = null,
  path = "",
  disabled = false,
  pad = null,
  margin = null,
  align = "",
  justify = "",
  href = ""
}) => {
  return (
    <Box pad={pad} align={align} justify={justify} margin={margin}>
      <Anchor
        icon={icon}
        primary={primary}
        label={label}
        onClick={onClick}
        path={path}
        disabled={disabled}
        href={href}
      />
    </Box>
  );
};

Anchors.propTypes = {
  label: PropTypes.node,
  icon: PropTypes.element,
  primary: PropTypes.bool,
  onClick: PropTypes.func,
  path: PropTypes.string,
  disabled: PropTypes.bool,
  pad: PropTypes.object,
  align: PropTypes.string,
  justify: PropTypes.string,
  margin: PropTypes.object,
  href: PropTypes.string
};

export default Anchors;
