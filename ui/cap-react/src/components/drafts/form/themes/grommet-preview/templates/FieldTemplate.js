import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import FieldHeader from "../components/FieldHeader";

let FieldTemplate = function(props) {
  const { label, children, formContext } = props;

  if (["array", "object"].indexOf(props.schema.type) > -1) {
    return (
      <span
        style={{ gridColumn: "1/5", height: "100%" }}
        className={
          formContext.tabView
            ? "overview-content-readonly"
            : "overview-content-readonly align-center"
        }
      >
        {children}
      </span>
    );
  }

  return children.props && children.props.formData === undefined ? null : (
    <Box
      flex={true}
      direction="row"
      margin={{ bottom: "medium", horizontal: "medium" }}
      style={{ borderRadius: "3px", gridColumn: "1/5" }}
      separator="bottom"
    >
      {label ? (
        <Box flex basis="1/2" style={{ paddingRight: "10px" }}>
          <FieldHeader title={label} italic />
        </Box>
      ) : null}
      <Box flex basis="3/4" justify="center">
        {children}
      </Box>
    </Box>
  );
};

FieldTemplate.propTypes = {
  label: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  schema: PropTypes.object
};

export default FieldTemplate;
