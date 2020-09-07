import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import FieldHeader from "../components/FieldHeader";

let FieldTemplate = function(props) {
  const { label, children } = props;
  if (["array", "object"].indexOf(props.schema.type) > -1) {
    return <span style={{ gridColumn: "1/5" }}>{children}</span>;
  }

  return children.props && children.props.formData === undefined ? null : (
    <Box
      flex={true}
      direction="row"
      // colorIndex={label.match(/^\d/) ? "" : "light-1"}
      margin={{ bottom: "small", horizontal: "medium" }}
      pad={{ vertical: "small", horizontal: "small" }}
      style={{ borderRadius: "3px", gridColumn: "1/5" }}
    >
      {label ? (
        <Box
          flex
          basis="1/2"
          style={{ paddingRight: "10px" }}
          margin={{ bottom: "small" }}

          // separator={label.match(/^\d/) ? "" : "bottom"}
        >
          <FieldHeader
            title={label}
            italic={!label.match(/^\d/)}
            bold={label.match(/^\d/)}
          />
        </Box>
      ) : null}
      <Box flex basis="3/4" colorIndex="light-1" justify="center">
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
