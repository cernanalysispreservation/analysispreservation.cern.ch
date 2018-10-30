import _isEmpty from "lodash/isEmpty";
import React from "react";
import PropTypes from "prop-types";

import { Box, Label } from "grommet";
// import FieldHeader from "../components/FieldHeader";

let FieldTemplate = function(props) {
  const { id, label, rawErrors = [], children } = props;
  let _errors = null;

  if (rawErrors.length > 0)
    _errors = rawErrors.map((error, index) => <span key={index}>{error}</span>);

  if (["array", "object"].indexOf(props.schema.type) > -1) {
    return <span>{children}</span>;
  }
  return (
    <Box key={id + label} pad="none">
      <Label margin="none" size="small" strong="none">
        {label}
      </Label>
      {_errors}
      {(children.props.formData && _isEmpty(children.props.formData)) ||
      children.props.formData === undefined ? (
        <Box colorIndex="light-2" pad="small" margin={{ top: "small" }}>
          No {label} provided.
        </Box>
      ) : (
        <Box colorIndex="light-2" pad="small" margin={{ top: "small" }}>
          {children}{" "}
        </Box>
      )}
    </Box>
  );
};

FieldTemplate.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  rawDescription: PropTypes.string,
  rawErrors: PropTypes.object,
  schema: PropTypes.object,
  children: PropTypes.element
};

export default FieldTemplate;
