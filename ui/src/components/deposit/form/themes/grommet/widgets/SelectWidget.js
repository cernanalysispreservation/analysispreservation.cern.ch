import React from 'react';
import PropTypes from 'prop-types';

import { Box, Select } from 'grommet';

const SelectWidget = function(props) {
  // TOFIX onBlur, onFocus
  let _onChange = function _onChange(_ref) {
    let value = _ref.value.value;
    return props.onChange(value === "" ? props.options.emptyValue : value);
  };

  return (
    <Box flex={true} pad={{"horizontal": "medium"}}>
      <Select
        placeHolder={props.placeholder}
        inline={false}
        multiple={false}
        options={props.options.enumOptions}
        value={props.value}
        onBlur={props.onBlur}
        onChange={_onChange} />
    </Box>
  );
};

SelectWidget.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  placeholder: PropTypes.string
};

export default SelectWidget;