import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import DefaultArrayField from "./DefaultArrayField";
import StringArrayField from "./StringArrayField";
import FieldHeader from "../components/FieldHeader";

let ArrayFieldTemplate = function(props) {
  const { items, uiSchema, title } = props;

  if (items.length === 0) return null;

  if (uiSchema["ui:array"] === "StringArrayField") {
    return (
      <Box flex={true} direction="row">
        <Box size={{ width: "small" }}>
          <FieldHeader title={title} uiSchema={uiSchema} />
        </Box>
        <StringArrayField {...props} />
      </Box>
    );
  } else
    return (
      <Box flex={true}>
        <Box>
          <FieldHeader title={title} uiSchema={uiSchema} />
        </Box>
        <Box>
          <DefaultArrayField {...props} />
        </Box>
      </Box>
    );
};

ArrayFieldTemplate.propTypes = {
  uiSchema: PropTypes.object,
  schema: PropTypes.object,
  onAddClick: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  items: PropTypes.array
};

export default ArrayFieldTemplate;
