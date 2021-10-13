import React, { useState } from "react";
import PropTypes from "prop-types";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import { Box, Heading, Label } from "grommet";

const ExpandableBox = ({
  header,
  label,
  children,
  shouldBeOpen,
  rightLabel = null
}) => {
  const [display, setDisplay] = useState(shouldBeOpen);
  return (
    <Box
      style={{
        border: "0.5px solid rgba(0,0,0,0.3)",
        borderRadius: "3px"
      }}
      pad="small"
      margin={{ bottom: "large" }}
    >
      <Box
        direction="row"
        justify="between"
        align="center"
        responsive={false}
        onClick={() => setDisplay(display => !display)}
      >
        <Box>
          <Heading tag="h3" margin="none" strong>
            {header}
          </Heading>
          <Label size="small">{label}</Label>
        </Box>
        <Box direction="row" responsive={false} align="center">
          {rightLabel && (
            <Label
              style={{ marginRight: "10px", color: "rgba(0,0,0,0.5)" }}
              margin="none"
            >
              {rightLabel}
            </Label>
          )}
          {display ? <AiOutlineUp size={18} /> : <AiOutlineDown size={18} />}
        </Box>
      </Box>

      {display && (
        <Box flex margin={{ top: "medium" }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

ExpandableBox.propTypes = {
  header: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node
};

export default ExpandableBox;
