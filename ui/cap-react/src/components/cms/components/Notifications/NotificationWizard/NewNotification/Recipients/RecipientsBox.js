import React, { useState } from "react";
import PropTypes from "prop-types";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import { Box, Heading, Label } from "grommet";

const RecipientsBox = ({ header, label, children, count = 0 }) => {
  const [display, setDisplay] = useState(false);
  return (
    <Box
      style={{
        border: "1px solid rgba(0,0,0,0.5)",
        borderRadius: "3px",
        width: "100%"
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
          <Heading tag="h4" margin="none">
            {header}
          </Heading>
          <Label size="small">{label}</Label>
        </Box>
        <Box direction="row" responsive={false} align="center">
          <Label
            style={{ marginRight: "10px", color: "rgba(0,0,0,0.5)" }}
            margin="none"
          >
            {count} selected
          </Label>
          {display ? <AiOutlineUp size={18} /> : <AiOutlineDown size={18} />}
        </Box>
      </Box>

      {display && children}
    </Box>
  );
};

RecipientsBox.propTypes = {
  header: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node
};

export default RecipientsBox;
