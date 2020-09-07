import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Tag from "../../../../../partials/Tag";
import FieldHeader from "../components/FieldHeader";

const SelectWidget = function(props) {
  if (props.schema.type === "array") {
    return (
      <Box
        flex={true}
        direction="row"
        margin={{ bottom: "small", horizontal: "medium" }}
        pad={{ vertical: "small", horizontal: "small" }}
        style={{ borderRadius: "3px", gridColumn: "1/5" }}
      >
        <Box
          flex
          basis="1/2"
          style={{ paddingRight: "10px" }}
          margin={{ bottom: "small" }}
        >
          <FieldHeader title={props.schema.title} italic />
        </Box>

        <Box flex basis="3/4" justify="center">
          <Box justify="center" flex={false} alignSelf="start">
            <Tag
              text={props.value || ""}
              color={{
                bgcolor: "#006996",
                border: "#006996",
                color: "#fff"
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  }
  return (
    <Box justify="center" flex={false} alignSelf="start">
      <Tag
        text={props.value || ""}
        color={{
          bgcolor: "#006996",
          border: "#006996",
          color: "#fff"
        }}
      />
    </Box>
  );
};

SelectWidget.propTypes = {
  value: PropTypes.string
};

export default SelectWidget;
