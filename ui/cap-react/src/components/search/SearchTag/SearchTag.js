import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import { AiOutlineClose } from "react-icons/ai";

const SearchTag = ({ query, onClick, searchQuery = null, removeQuery }) => {
  if (!query) return null;

  return (
    <Box
      direction="row"
      responsive={false}
      align="center"
      style={{ background: "#f5f5f5" }}
      margin={{ bottom: "small" }}
      wrap
      className="search_result_box"
    >
      {searchQuery && (
        <Box
          direction="row"
          responsive={false}
          margin={{ right: "small", bottom: "small" }}
          style={{ background: "#fff" }}
        >
          <Box
            style={{
              padding: "3px 15px",
              border: "1px solid rgba(0,0,0,0.2)"
            }}
          >
            {`Query: ${decodeURIComponent(searchQuery)}`}
          </Box>
          <Box
            onClick={() => removeQuery()}
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
      )}
      {query.map((item, index) => (
        <Box
          key={index}
          direction="row"
          responsive={false}
          margin={{ right: "small", bottom: "small" }}
          style={{ background: "#f1f1f1" }}
        >
          <Box
            style={{
              padding: "3px 15px",
              border: "1px solid rgba(0,0,0,0.2)"
            }}
          >
            {`${item.split("=")[0]}:${decodeURIComponent(item.split("=")[1])}`}
          </Box>
          <Box
            onClick={() => onClick(item)}
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
      ))}
    </Box>
  );
};

SearchTag.propTypes = {
  query: PropTypes.string,
  onClick: PropTypes.func,
  searchQuery: PropTypes.string,
  removeQuery: PropTypes.func
};

export default SearchTag;
