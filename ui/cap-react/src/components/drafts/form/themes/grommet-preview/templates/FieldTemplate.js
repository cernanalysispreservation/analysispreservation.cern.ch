import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import FieldHeader from "../components/FieldHeader";

let FieldTemplate = function(props) {
  const { label, children } = props;

  if (["array", "object"].indexOf(props.schema.type) > -1) {
    return <span>{children}</span>;
  }

  return children.props && children.props.formData === undefined ? null : (
    <Box flex={true} direction="row">
      {label ? (
        <Box flex={true}>
          <FieldHeader title={label} />
        </Box>
      ) : null}
      <Box flex={true}>{children}</Box>
    </Box>
  );
};

FieldTemplate.propTypes = {
  label: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  schema: PropTypes.object
};

export default FieldTemplate;
