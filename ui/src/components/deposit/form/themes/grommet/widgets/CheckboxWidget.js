import React from 'react';
import PropTypes from 'prop-types';

import { CheckBox, Box } from 'grommet';

function selectValue(value, selected, all) {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
}

function deselectValue(value, selected) {
  return selected.filter(v => v !== value);
}

const CheckBoxWidget = function(props) {
  // TOFIX onBlur, onFocus
  let _onChange = event => {
    const all = props.options.enumOptions.map(({ value }) => value);
    if (event.target.checked) {
      props.onChange(selectValue(event.target.value, props.value, all));
    } else {
      props.onChange(deselectValue(event.target.value, props.value));
    }
  };

  // let _errors = null;
  // if (props.rawErrors && props.rawErrors.length > 0)
  //   _errors = props.rawErrors.map((error, index) => <span key={index}>{error}</span>);

  return (
    <Box pad="medium">
      {
        props.options.enumOptions.length > 0 ?
        props.options.enumOptions.map( item => (
          <CheckBox
            key={item.label}
            inline="true"
            name={item.label}
            label={item.value}
            value={item.value}
            onChange={_onChange} />
        )) : null
      }
    </Box>
  );
};

CheckBoxWidget.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  rawErrors: PropTypes.object,
  schema: PropTypes.object
};

export default CheckBoxWidget;