import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import FieldHeader from "../components/FieldHeader";

let FieldTemplate = function(props) {
  const { label, children, formContext, uiSchema } = props;

  return children[0].props &&
    children[0].props.formData === undefined ? null : (
    <Box
      flex={true}
      style={{
        borderRadius: "3px",
        gridColumn: "1/5",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        padding: "10px"
      }}
      id="fieldTemplate"
      className={
        formContext.tabView
          ? "fieldTemplate "
          : "fieldTemplate align-form-center"
      }
    >
      {(label && !(["array"].indexOf(props.schema.type) > -1)) ||
      props.schema.uniqueItems ? (
        <Box
          flex
          style={{
            paddingRight: "10px",
            gridColumn:
              ["array", "object"].indexOf(props.schema.type) > -1
                ? props.schema.uniqueItems
                  ? "1/3"
                  : "1/5"
                : label
                  ? "1/3"
                  : "1/5"
          }}
        >
          <FieldHeader title={label} bold uiSchema={uiSchema} />
        </Box>
      ) : null}

      <Box
        flex
        justify="center"
        style={{
          gridColumn:
            ["array", "object"].indexOf(props.schema.type) > -1
              ? props.schema.uniqueItems
                ? "3/5"
                : "1/5"
              : label
                ? "3/5"
                : "1/5"
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

FieldTemplate.propTypes = {
  label: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  schema: PropTypes.object,
  formContext: PropTypes.object,
  uiSchema: PropTypes.object
};

export default FieldTemplate;
