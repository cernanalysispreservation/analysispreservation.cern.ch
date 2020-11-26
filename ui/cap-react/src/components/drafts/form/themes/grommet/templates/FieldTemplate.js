import React from "react";
import PropTypes from "prop-types";

import FormField from "grommet/components/FormField";
import Box from "grommet/components/Box";
import FieldHeader from "../../grommet-preview/components/FieldHeader";
import { Paragraph } from "grommet";

let FieldTemplate = function(props) {
  const { id, label, rawDescription, children, uiSchema, required } = props;

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
          gridColumn: gridColumns ? gridColumns : "1 / 5",
          borderRight: "1px dotted rgba(0, 0, 0, 0.15)",
          borderLeft: "1px dotted rgba(0, 0, 0, 0.15)",
          padding: props.id === "root" ? null : "10px 24px"
        }}
        flex={
          props.uiSchema["ui:object"] &&
          props.uiSchema["ui:object"] === "tabView"
            ? true
            : null
        }
        className="fieldTemplate"
      >
        {!props.schema.type.includes("array") && (
          <Box margin={props.id === "root" ? null : { bottom: "small" }}>
            <FieldHeader required={required} title={label} italic bold />
            <Paragraph size="small" margin="none">
              {rawDescription}
            </Paragraph>
          </Box>
        )}
        {children}
      </Box>
    );
  }

  return (
    <FormField
      label={
        <span>
          <span
            style={{ color: "#000" }}
            dangerouslySetInnerHTML={{ __html: label }}
          />
          {required &&
            (label ? (
              <strong style={{ padding: "0 3px" }}>*</strong>
            ) : (
              <div
                style={{ position: "absolute", marginLeft: "10px", left: 0 }}
              >
                <div>
                  <strong>*</strong>
                </div>
              </div>
            ))}
          {rawDescription ? (
            <span
              style={{ marginLeft: "10px" }}
              dangerouslySetInnerHTML={{ __html: rawDescription }}
            />
          ) : null}
        </span>
      }
      key={id + label}
      error={props.rawErrors && props.rawErrors.length ? true : false}
      style={{
        gridColumn: gridColumns ? gridColumns : "1 / 5",
        overflow: "visible"
      }}
      className="fieldTemplate"
    >
      {children}
      {props.rawErrors && props.rawErrors.length ? (
        <Box
          style={{ fontSize: "12px", lineHeight: "12px", color: "#f04b37" }}
          flex={false}
          pad={{ horizontal: "small" }}
        >
          {props.rawErrors.map((error, index) => [
            <span key={index}>
              {index + 1}. {error}
            </span>
          ])}
        </Box>
      ) : null}
    </FormField>
  );
};

FieldTemplate.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  rawDescription: PropTypes.string,
  schema: PropTypes.object,
  children: PropTypes.node,
  rawErrors: PropTypes.array,
  uiSchema: PropTypes.object
};

export default FieldTemplate;
