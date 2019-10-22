import React from "react";
import PropTypes from "prop-types";

import FormField from "grommet/components/FormField";
import Box from "grommet/components/Box";

let FieldTemplate = function(props) {
  const {
    id,
    label,
    rawDescription,
    rawErrors = [],
    children,
    uiSchema
  } = props;

  let _errors = "";
  let gridColumns = null;

  if (rawErrors.length > 0)
    rawErrors.map((error, index) => {
      _errors += `(${index + 1}) ${error} `;
    });

  // if the grid options exists in uiSchema pass it as prop
  // else set it full width
  if (props.uiSchema["ui:options"] && props.uiSchema["ui:options"].grid) {
    gridColumns = props.uiSchema["ui:options"].grid.gridColumns
      ? props.uiSchema["ui:options"].grid.gridColumns
      : "1/5";
  }

  if (["array", "object"].indexOf(props.schema.type) > -1) {
    // if (props.id === "root") {
    //   gridColumns = null;
    // }
    return (
      <Box
        style={{
          borderLeft: rawErrors.length > 0 ? "2px #F04B37 solid" : null,
          gridColumn: gridColumns ? gridColumns : "1 / 5"
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <FormField
      label={
        <span>
          <span style={{ color: "#000" }}>{label}</span>
          {rawDescription ? (
            <span style={{ color: "#bbb" }}> &nbsp; {rawDescription}</span>
          ) : null}
        </span>
      }
      key={id + label}
      error={rawErrors.length > 0 ? _errors : null}
      style={{
        gridColumn: gridColumns ? gridColumns : "1 / 5"
      }}
    >
      {children}
    </FormField>
  );
};

FieldTemplate.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  rawDescription: PropTypes.string,
  rawErrors: PropTypes.array,
  schema: PropTypes.object,
  children: PropTypes.array
};

export default FieldTemplate;
