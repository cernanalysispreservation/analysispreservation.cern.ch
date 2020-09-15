import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import FieldHeader from "../components/FieldHeader";

let FieldTemplate = function(props) {
  const { label, children, formContext } = props;

  if (["array", "object"].indexOf(props.schema.type) > -1) {
    return (
      <span
        style={{
          gridColumn: "1/5",
          height: "100%"
        }}
        className={
          formContext.tabView
            ? "overview-content-readonly fieldTemplate"
            : "overview-content-readonly align-center fieldTemplate"
        }
      >
        {children}
      </span>
    );
  }

  return children[0].props &&
    children[0].props.formData === undefined ? null : (
    <Box
      flex={true}
      margin={{ horizontal: "medium" }}
      style={{
        borderRadius: "3px",
        gridColumn: "1/5",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        padding: "10px"
      }}
      id="fieldTemplate"
      className="fieldTemplate"
    >
      {label ? (
        <Box
          flex
          style={{
            paddingRight: "10px",
            gridColumn: "1/3"
          }}
        >
          <FieldHeader title={label} italic bold />
        </Box>
      ) : null}

      <Box flex justify="center" style={{ gridColumn: label ? "3/5" : "1/5" }}>
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
