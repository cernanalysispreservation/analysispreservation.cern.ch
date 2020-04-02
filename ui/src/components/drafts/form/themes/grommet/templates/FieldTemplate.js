import React from "react";
import PropTypes from "prop-types";

import FormField from "grommet/components/FormField";
import Box from "grommet/components/Box";

let FieldTemplate = function(props) {
  const { id, label, rawDescription, children, uiSchema } = props;

  let gridColumns = null;

  if (uiSchema && uiSchema["ui:options"] && uiSchema["ui:options"].hidden) {
    return <React.Fragment />;
  }

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
          gridColumn: gridColumns ? gridColumns : "1 / 5"
        }}
        flex={
          props.uiSchema["ui:object"] &&
          props.uiSchema["ui:object"] === "tabView"
            ? true
            : null
        }
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
      error={
        props.rawErrors && props.rawErrors.length ? (
          <Box
            style={{ maxWidth: "250px", fontSize: "11px", lineHeight: "12px" }}
          >
            {props.rawErrors.map((error, index) => [
              <span key={index}>
                {index + 1}. {error}
              </span>
            ])}
          </Box>
        ) : null
      }
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
  schema: PropTypes.object,
  children: PropTypes.node,
  uiSchema: PropTypes.object
};

export default FieldTemplate;
