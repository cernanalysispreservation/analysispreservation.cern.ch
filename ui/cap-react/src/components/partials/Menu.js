import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";

import MenuItem from "./MenuItem";

const Menu = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box>
      <Box onClick={() => setExpanded(!expanded)}>menu</Box>
      <Box
        style={{
          position: "absolute",
          bottom: "-80px",
          zIndex: 1,
          background: "red",
          minWidth: "120px",
          color: "#666"
        }}
      >
        {expanded &&
          ["settings", "b"].map(item => <MenuItem key={item} title={item} />)}
      </Box>
    </Box>
  );
};

Menu.propTypes = {};

export default Menu;
