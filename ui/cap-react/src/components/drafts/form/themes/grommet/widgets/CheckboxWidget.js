import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import CheckBox from "grommet/components/CheckBox";

function selectValue(value, selected = [], all) {
  console.log("VALUEEEe:::", value, selected, all)
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
}

function deselectValue(value, selected) {
  return selected.filter(v => v !== value);
}

const CheckBoxWidget = function (props) {

  let { id, type, title, description, items = {}, rawErrors = [] } = props.schema;

  // TOFIX onBlur, onFocus
  let _onChange = event => {
    if (props.schema.type == "boolean") {
      console.log("EVENT:::", event.target, event.target.checked)
      props.onChange(event.target.checked);
      return;
    }
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

  let _optionSelected = (option) => {
    if (props.value || props.value === false || props.value === 0) {
      if (type == "array" || type == "string" && props.value.indexOf) {
        return props.value.indexOf(option) > -1;
      }
      else {
        return props.value == option || props.value === option;
      }
    }
    return false;
  }

  let input;

  if (type == "boolean") {
    input = (
      <CheckBox
        disabled={props.readonly}
        key={props.id}
        inline="true"
        name={props.id}
        label={props.label}
        checked={props.value}
        onChange={_onChange}
      />
    );
  }
  else {
    input = props.options.enumOptions.length > 0
      ? props.options.enumOptions.map(item => (
        <CheckBox
          disabled={props.readonly}
          key={props.id + item.value}
          inline="true"
          name={props.id + item.value}
          label={item.label}
          checked={_optionSelected(item.value)}
          onChange={_onChange}
        />
      ))
      : null;
  }
  return (
    <Box pad="medium">
      {input}
    </Box>
  );
};

CheckBoxWidget.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.bool
  ]),
  options: PropTypes.object,
  rawErrors: PropTypes.object,
  schema: PropTypes.object,
  readonly: PropTypes.bool
};

export default CheckBoxWidget;
