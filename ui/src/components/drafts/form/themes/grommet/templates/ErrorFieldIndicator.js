import React from "react";
import Box from "grommet/components/Box";
import PropTypes from "prop-types";

const ErrorFieldIndicator = ({
  errors = [],
  children,
  id,
  hideIndicator = false,
  tab = false,
  properties = {}
}) => {
  let errorList = {};
  let errorMessages = {};

  if (tab) {
    errors &&
      errors.map(errorItem => {
        let item = errorItem.property.split(".")[1];

        properties.map(prop => {
          if (prop.name === item && !errorList[item]) {
            errorList[item] = "1px solid #f04b37";
          }
        });
      });

    return (
      <Box
        style={{
          borderRight: errorList[id]
        }}
      >
        {children}
      </Box>
    );
  } else {
    id = id.replace("root", "").replace("_path", "");

    errors &&
      errors.map(item => {
        let property = item.property
          .replace(/\[/g, "_")
          .replace(/\]/g, "")
          .replace(/\./g, "_");

        if (!errorList[property]) {
          errorMessages[property] = item.message;
          errorList[property] = hideIndicator ? undefined : "1px solid #f04b37";
        }
      });
  }

  return (
    <Box
      flex={!tab}
      style={{
        borderLeft: errorList[id]
      }}
    >
      {children}
      {hideIndicator &&
        errorMessages[id] && (
          <Box style={{ color: "#f04b37", margin: "1px 0 8px 4px" }}>
            {errorMessages[id]}
          </Box>
        )}
    </Box>
  );
};

ErrorFieldIndicator.propTypes = {
  errors: PropTypes.array,
  id: PropTypes.string,
  children: PropTypes.element,
  tab: PropTypes.bool,
  properties: PropTypes.object,
  hideIndicator: PropTypes.bool,
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

export default ErrorFieldIndicator;
