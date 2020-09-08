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
        margin={{ bottom: "small" }}
        pad={{ vertical: "small", horizontal: "s" }}
        style={{ borderRadius: "3px", gridColumn: "1/5" }}
      >
        <Box
          flex
          basis="1/2"
          pad={{ horizontal: "medium" }}
          margin={{ bottom: "small" }}
        >
          <FieldHeader title={props.schema.title} italic />
        </Box>

        <Box
          justify="start"
          align="start"
          flex
          basis="3/4"
          pad={{ horizontal: "medium" }}
          style={{ paddingBottom: "3px" }}
          direction="row"
          responsive={false}
          wrap
        >
          {props.value.map((val, index) => (
            <Box key={val + index} flex={false} style={{ margin: "5px" }} wrap>
              <Tag
                text={val || ""}
                color={{
                  bgcolor: "#fff",
                  border: "#006996",
                  color: "#000"
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
  return (
    <Box
      justify="center"
      flex={false}
      alignSelf="start"
      pad={{ horizontal: "medium" }}
      style={{ paddingBottom: "3px" }}
    >
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
