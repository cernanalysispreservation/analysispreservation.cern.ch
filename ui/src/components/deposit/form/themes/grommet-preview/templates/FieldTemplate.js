import React from 'react';
import PropTypes from 'prop-types';

import {Box, Label} from 'grommet';

let FieldTemplate = function (props) {
  const {id, label, rawDescription, rawErrors=[], children} = props;
  let _errors = null;

  if (rawErrors.length > 0)
    _errors = rawErrors.map((error, index) => <span key={index}>{error}</span>);

  if ( ["array", "object"].indexOf(props.schema.type) > -1) {
    return (
      <span>{children}</span>
    );
  }

  return (
    <Box key={id+label} pad="none">
      <Label margin="none" size="small" strong="none">
        {label}
      </Label>
      {_errors}
      {children}
    </Box>
  );
};

FieldTemplate.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  rawDescription: PropTypes.string,
  rawErrors: PropTypes.object,
  schema: PropTypes.object,
  children: PropTypes.element,
};

export default FieldTemplate;