import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Tag from "../../../../../partials/Tag";

const SelectWidget = function(props) {
  if (props.schema.type === "array") {
    return (
      <Box
        flex={true}
        direction="row"
        style={{
          borderRadius: "3px",
          gridColumn: "1/5",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          padding: "2px 5px"
        }}
        className="fieldTemplate"
      >
        <Box
          justify="start"
          align="start"
          pad={{ horizontal: "medium" }}
          style={{ paddingBottom: "3px", gridColumn: "1/5" }}
          direction="row"
          responsive={false}
          wrap
        >
          {(props.value.length > 0 &&
            props.value.map((val, index) => (
              <Box
                key={val + index}
                flex={false}
                style={{
                  margin: "0 5px 5px 0px"
                }}
                wrap
                justify="center"
                alignSelf="start"
              >
                <Tag
                  text={val || ""}
                  color={{
                    bgcolor: "#fff",
                    border: "#006996",
                    color: "#000"
                  }}
                />
              </Box>
            ))) || <Box style={{ margin: "5px" }}>-</Box>}
        </Box>
      </Box>
    );
  }
  return (
    <Box justify="center" alignSelf="start" pad={{ horizontal: "medium" }}>
      {(props.value && (
        <Tag
          text={props.value}
          color={{
            bgcolor: "#fff",
            border: "#006996",
            color: "#000"
          }}
        />
      )) ||
        ""}
    </Box>
  );
};

SelectWidget.propTypes = {
  value: PropTypes.string,
  schema: PropTypes.object
};

export default SelectWidget;
