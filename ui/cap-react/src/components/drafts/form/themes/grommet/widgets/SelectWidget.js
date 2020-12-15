import React, { useState } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";
import FieldHeader from "../components/FieldHeader";

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
const SelectWidget = function(props) {
  let {
    id,
    type,
    title,
    description,
    items = {},
    rawErrors = []
  } = props.schema;
  let _options = [];
  if (props.options && props.options.enumOptions)
    _options = props.options.enumOptions;
  else if (type == "boolean")
    _options = [
      { value: true, label: "True" },
      { value: false, label: "False" }
    ];
  else if (type != "array")
    _options = props.schema.enum.map(i => ({ value: i.value, label: i.value }));
  else
    _options = items.enum.map(i => ({ value: i.value, label: i.value })) || [];

  const [filteredOptions, setFilteredOptions] = useState(_options);

  // TOFIX onBlur, onFocus
  let _filterOptions = event => {
    let query = event.target.value;
    let filtered_options = _options.filter(
      i => i.value.toLowerCase().indexOf(query.toLowerCase()) > -1
    );
    setFilteredOptions(filtered_options);
  };

  let _onChange = function _onChange(value) {
    let _value = value;

    if (type == "array") {
      let valueIndex = props.value.indexOf(_value);
      if (valueIndex > -1) {
        let new_value = props.value.filter(e => e !== _value);
        props.onChange(new_value);
      } else {
        props.onChange([...props.value, _value]);
      }
    } else {
      // when the type is string, check if the new selected value is the same as the one saved
      // then it means that the user wants to un select it. If not the same, then just pass the value to the function
      value === props.value
        ? props.onChange(undefined)
        : props.onChange(_value);
    }
  };

  let _optionSelected = option => {
    if (props.value || props.value === false || props.value === 0) {
      if (type === "string" && props.value.indexOf) {
        return props.value === option;
      }
      if (type === "array") {
        return props.value.includes(option);
      }
    }
    return false;
  };

  let _children = [
    !props.readonly ? (
      <Box
        key="box-select-widget"
        direction="row"
        responsive={false}
        wrap={true}
        margin={{ top: "small" }}
        pad={{ horizontal: "medium", between: "small" }}
      >
        {filteredOptions &&
          filteredOptions.map(option => (
            <Box
              key={option.value}
              justify="center"
              flex={false}
              style={{
                border: "1px solid #006996",
                borderRadius: "2px",
                marginBottom: "10px",
                padding: "5px",
                maxWidth: "100%",
                backgroundColor: _optionSelected(option.value)
                  ? "#006996"
                  : null,
                color: _optionSelected(option.value) ? "#fff" : null
              }}
              onClick={() => _onChange(option.value)}
            >
              {option.label}
            </Box>
          ))}
      </Box>
    ) : (
      <Box pad={{ horizontal: "medium" }} key="box-select-widget">
        <Paragraph>
          {`Selected Value:  ${props.value || " user inserted no value"}`}
        </Paragraph>
      </Box>
    ),
    rawErrors && rawErrors.length ? (
      <Box
        key="box-select-widget-rawErrors"
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
    ) : null
  ];

  if (type !== "array") return _children;

  return (
    <Box style={{ border: rawErrors.length ? "1px solid #F04B37" : null }}>
      <Box direction="row" wrap={false}>
        <Box flex={true} direction="row" wrap={false}>
          <FieldHeader margin="none" title={title || id} italic bold />
          <Box justify="center">
            {description ? (
              <span style={{ color: "#bbb" }}>
                {" "}
                &nbsp;{" "}
                {<span dangerouslySetInnerHTML={{ __html: description }} />}
              </span>
            ) : null}
          </Box>
        </Box>
        <Box flex={false} alignSelf="end">
          <input
            onChange={_filterOptions}
            style={{ height: "24px", borderRadius: "0", padding: "0 5px" }}
            placeholder="Filter options"
          />
        </Box>
      </Box>
      {_children}
    </Box>
  );
};

SelectWidget.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  options: PropTypes.object,
  schema: PropTypes.object,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool
};

export default SelectWidget;
