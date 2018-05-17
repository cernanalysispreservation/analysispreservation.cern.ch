import React from 'react';
import PropTypes from 'prop-types';

import FormField from 'grommet/components/FormField';

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
    <FormField
      help={rawDescription ? rawDescription : null}
      label={label ? label : null }
      key={id+label}
      error={_errors}>
      {children}
    </FormField>
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