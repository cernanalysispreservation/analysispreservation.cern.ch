import React, { useState } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import { FormField } from "grommet";

// Work for schema with 'type: "array"', with 'uniqueItems: true and
// type: "string" items with enum
// e.g
// {
//   "type": "array",
//   "uniqueItems": true
//   "items": {
//     "type": "string",
//     "enum": ["aa", "bb", "cc"]
//   }
// }
const SelectWidget = function (props) {
  let _options = props.schema.items.enum;
  const [filteredOptions, setFilteredOptions] = useState(_options);

  // TOFIX onBlur, onFocus
  let _filterOptions = (event) => {
    let query = event.target.value;
    let filtered_options = _options
      .filter(i => i.toLowerCase().indexOf(query.toLowerCase()) > -1);
    setFilteredOptions(filtered_options);
  };

  let _onChange = function _onChange(value) {
    let _value = value;

    if (props.schema && props.schema.type == "array") {
      let valueIndex = props.value.indexOf(_value);
      if (valueIndex > -1) {
        let new_value = props.value.filter(e => e !== _value);
        props.onChange(new_value);
      }
      else {
        props.onChange([...props.value, _value]);
      }
    }
    else {
      props.onChange(_value);
    }
  };


  let { id, title, description, rawErrors = [] } = props.schema;
  return (
    <FormField
      label={
        <Box direction="row" wrap={false}>
          <Box flex={true} direction="row" wrap={false}>
            <span style={{ color: "#000" }}>{title || id}</span>
            {description ? (
              <span style={{ color: "#bbb" }}> &nbsp; {description}</span>
            ) : null}
          </Box>
          <Box flex={false} alignSelf="end">
            <input onChange={_filterOptions} style={{ height: "24px", borderRadius: "0", padding: "0 5px" }} placeholder="Filter options" />
          </Box>
        </Box>
      }
      key={id}
      error={rawErrors.length ? true : false}
    >
      {
        !props.readonly ? (
          <Box direction="row" responsive={false} wrap={true} margin={{ top: "small" }} pad={{ horizontal: "medium", between: "small" }}>
            {filteredOptions.map(option => (
              <Box
                key={option}
                justify="center"
                flex={false}
                style={{
                  border: "1px solid #006996",
                  borderRadius: "2px",
                  marginBottom: "10px",
                  padding: "5px",
                  backgroundColor: props.value.indexOf(option) > -1 ? "#006996" : null,
                  color: props.value.indexOf(option) > -1 ? "#fff" : null
                }}
                onClick={() => _onChange(option)}>{option}</Box>
            ))}
          </Box>

        ) : (
            <Box pad={{ horizontal: "medium" }}>
              <Paragraph>
                {`Selected Value:  ${props.value || " user inserted no value"}`}
              </Paragraph>
            </Box>

          )
      }
      {rawErrors && rawErrors.length ? (
        <Box
          style={{ fontSize: "12px", lineHeight: "12px", color: "#f04b37" }}
          flex={false}
          pad={{ horizontal: "medium" }}
        >
          {rawErrors.map((error, index) => [
            <span key={index}>
              {index + 1}. {error}
            </span>
          ])}
        </Box>
      ) : null}
    </FormField>
  );
};

SelectWidget.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  schema: PropTypes.object,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool
};

export default SelectWidget;
