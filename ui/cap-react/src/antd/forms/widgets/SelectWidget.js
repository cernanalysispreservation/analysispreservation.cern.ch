/* eslint-disable no-else-return */
import React, { useState } from "react";
import { connect } from "react-redux";
import { utils } from "@rjsf/core";
import Select from "antd/lib/select";
import debounce from "lodash/debounce";
import axios from "axios";
import { fromJS } from "immutable";

const { asNumber, guessType } = utils;

const SELECT_STYLE = {
  width: "100%"
};

const nums = new Set(["number", "integer"]);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema, value) => {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;

  if (value === "") {
    return undefined;
  } else if (type === "array" && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every(x => guessType(x) === "number")) {
      return asNumber(value);
    } else if (schema.enum.every(x => guessType(x) === "boolean")) {
      return value === "true";
    }
  }

  return value;
};

const SelectWidget = ({
  autofocus,
  disabled,
  formContext,
  id,
  // label,
  multiple,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  readonly,
  // required,
  schema,
  value,
  formData
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const { enumOptions, enumDisabled, suggestions, params } = options;

  const handleChange = nextValue => onChange(processValue(schema, nextValue));

  const handleBlur = () => onBlur(id, processValue(schema, value));

  const handleFocus = () => onFocus(id, processValue(schema, value));

  const getPopupContainer = node => node.parentNode;

  const stringify = currentValue =>
    Array.isArray(currentValue) ? value.map(String) : String(value);

  const _replace_hash_with_current_indexes = path => {
    let indexes = id.split("_").filter(item => !isNaN(item)),
      index_cnt = 0;

    return path.map(item => {
      item = item === "#" ? indexes[index_cnt] : item;
      if (!isNaN(item)) ++index_cnt;
      return item;
    });
  };
  const updateSearch = (value, cb = null) => {
    let data = fromJS(formData);

    if (params) {
      for (let param in params) {
        let path = params[param];

        // replace # with current input path
        path = _replace_hash_with_current_indexes(path);

        let suggestions = suggestions.replace(
          `${param}=`,
          `${param}=${data.getIn(path, "") || ""}`
        );
      }
    }

    axios
      .get(`${suggestions}${value}`)
      .then(({ data }) => {
        if (cb) {
          cb(data.map(value => ({ value, label: value })));
        }
        setSearchValues(data.map(value => ({ value, label: value })));
      })
      .catch(err => {
        // this.setState({
        //   error:
        //     err.response.status !== 500
        //       ? err.response.data && err.response.data.message
        //         ? err.response.data.message
        //         : "Something went wrong with the request "
        //       : "Something went wrong with the request "
        // });
      });
  };

  const [searchValues, setSearchValues] = useState([]);

  let valuesToRender = suggestions ? searchValues : enumOptions;
  return (
    <Select
      autoFocus={autofocus}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      getPopupContainer={getPopupContainer}
      id={id}
      mode={typeof multiple !== "undefined" ? "multiple" : undefined}
      name={id}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onSearch={debounce(updateSearch, 500)}
      onFocus={!readonly ? handleFocus : undefined}
      placeholder={placeholder}
      style={SELECT_STYLE}
      value={typeof value !== "undefined" ? stringify(value) : undefined}
      showSearch={suggestions}
    >
      {valuesToRender.map(({ value: optionValue, label: optionLabel }) => (
        <Select.Option
          disabled={enumDisabled && enumDisabled.indexOf(optionValue) !== -1}
          key={String(optionValue)}
          value={String(optionValue)}
        >
          {optionLabel}
        </Select.Option>
      ))}
    </Select>
  );
};

SelectWidget.defaultProps = {
  formContext: {}
};

const mapStateToProps = state => ({
  formData: state.draftItem.get("formData")
});

export default connect(
  mapStateToProps,
  null
)(SelectWidget);
