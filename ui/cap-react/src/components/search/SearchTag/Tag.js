import React from "react";
import Box from "grommet/components/Box";
import { AiOutlineClose } from "react-icons/ai";
import PropTypes from "prop-types";

const Tag = ({ text, onClick, background = "#fff" }) => {
  return (
    <Box
      direction="row"
      responsive={false}
      margin={{ right: "small", bottom: "small" }}
      style={{ background: background }}
    >
      <Box
        style={{
          padding: "3px 15px",
          border: "1px solid rgba(0,0,0,0.2)"
        }}
      >
        {text}
      </Box>
      <Box
        onClick={onClick}
        align="center"
        justify="center"
        style={{
          padding: "3px 5px",
          border: "1px solid rgba(0, 0, 0, 0.2)",
          borderLeft: 0
        }}
      >
        <AiOutlineClose />
      </Box>
    </Box>
  );
};

Tag.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  background: PropTypes.string
};

export default Tag;
