import React from "react";
import Box from "grommet/components/Box";
import PropTypes from "prop-types";

const ErrorFieldIndicator = ({
  errors,
  children,
  id,
  hideIndicator = false,
  tab = false,
  properties = {}
}) => {
  let errorList = [];
  let errorMessages = {};

  if (tab) {
    errors &&
      errors.map(errorItem => {
        let item = errorItem.property.split(".")[1];
        properties.map(prop => {
          if (prop.name === item && !errorList.includes(item)) {
            errorList.push(item);
          }
        });
      });

    return (
      <Box
        style={{
          borderRight: errorList.includes(id) ? "1px solid #f04b37" : null
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

        if (!errorList.includes(property)) {
          if (item.message) {
            errorMessages[property] = item.message;
          }
          errorList.push(property);
        }
      });
  }

  return (
    <Box
      flex={!tab}
      style={{
        borderLeft: hideIndicator
          ? null
          : errorList.includes(id)
            ? "1px solid #f04b37"
            : null
      }}
    >
      {children}

      {hideIndicator &&
        Object.entries(errorMessages).map(item => {
          if (item[0] === id) {
            return (
              <Box style={{ color: "#f04b37", margin: "1px 0 8px 4px" }}>
                {item[1]}
              </Box>
            );
          }
        })}
    </Box>
  );
};

ErrorFieldIndicator.propTypes = {
  errors: PropTypes.array,
  id: PropTypes.string,
  children: PropTypes.element,
  tab: PropTypes.bool,
  properties: PropTypes.object,
  hideIndicator: PropTypes.bool
};

export default ErrorFieldIndicator;
