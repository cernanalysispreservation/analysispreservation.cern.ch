import { useState } from "react";
import { connect } from "react-redux";
import Select from "antd/lib/select";
import { debounce } from "lodash-es";
import axios from "../../../axios";
import { fromJS } from "immutable";
import { Empty } from "antd";
import PropTypes from "prop-types";

import {
  ariaDescribedByIds,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
} from "@rjsf/utils";
import isString from "lodash-es";

const SelectWidget = ({
  autofocus,
  disabled,
  formContext,
  id,
  multiple,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  readonly,
  value,
  formData,
}) => {
  const { readonlyAsDisabled = true } = formContext;

  const { enumOptions, enumDisabled, suggestions, params, emptyValue } =
    options;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleChange = nextValue => {
    onChange(
      enumOptionsValueForIndex(nextValue, enumOptions || data, emptyValue)
    );
  };

  const handleBlur = () =>
    onBlur(id, enumOptionsValueForIndex(value, enumOptions, emptyValue));

  const handleFocus = () =>
    onFocus(id, enumOptionsValueForIndex(value, enumOptions, emptyValue));

  const handleSearch = newValue => {
    updateSearch(newValue, setData);
  };

  const filterOption = (input, option) => {
    if (option && isString(option.label)) {
      // labels are strings in this context
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    return false;
  };

  const getPopupContainer = node => node.parentNode;

  const selectedIndexes = enumOptionsIndexForValue(
    value,
    enumOptions,
    multiple
  );

  const _replace_hash_with_current_indexes = path => {
    let indexes = id.split("_").filter(item => !isNaN(item)),
      index_cnt = 0;

    return path.map(item => {
      item = item === "#" ? indexes[index_cnt] : item;
      if (!isNaN(item)) ++index_cnt;
      return item;
    });
  };

  const updateSearch = (value, callback) => {
    let data = fromJS(formData);
    if (params) {
      Object.entries(params).map(param => {
        const path = _replace_hash_with_current_indexes(param[1]);
        suggestions.replace(
          `${param[0]}=`,
          `${param[0]}=${data.getIn(path, "") || ""}`
        );
      });
    }
    setLoading(true);
    axios
      .get(`${suggestions}${value}`)
      .then(({ data }) => {
        callback(data.map(value => ({ value, label: value })));
        setLoading(false);
      })
      .catch(() => {
        callback([]);
        setLoading(false);
      });
  };

  let valuesToRender = suggestions ? data : enumOptions;

  // Antd's typescript definitions do not contain the following props that are actually necessary and, if provided,
  // they are used, so hacking them in via by spreading `extraProps` on the component to avoid typescript errors
  const extraProps = {
    name: id,
  };
  return (
    <Select
      autoFocus={autofocus}
      disabled={disabled || (readonlyAsDisabled && readonly)}
      getPopupContainer={getPopupContainer}
      id={id}
      mode={multiple ? "multiple" : undefined}
      onBlur={!readonly ? handleBlur : undefined}
      onChange={!readonly ? handleChange : undefined}
      onFocus={!readonly ? handleFocus : undefined}
      onSearch={suggestions && debounce(handleSearch, 500)}
      showSearch={suggestions}
      placeholder={placeholder}
      value={suggestions ? value : selectedIndexes}
      {...extraProps}
      filterOption={filterOption}
      aria-describedby={ariaDescribedByIds(id)}
      loading={loading}
      notFoundContent={
        <Empty description="No Results" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
      options={
        Array.isArray(valuesToRender) &&
        valuesToRender.map(
          ({ value: optionValue, label: optionLabel }, index) => {
            return {
              key: String(index),
              value: String(index),
              label: optionLabel,
              disabled:
                Array.isArray(enumDisabled) &&
                enumDisabled.indexOf(optionValue) !== -1,
            };
          }
        )
      }
    />
  );
};

SelectWidget.defaultProps = {
  formContext: {},
};
SelectWidget.propTypes = {
  disabled: PropTypes.bool,
  autofocus: PropTypes.bool,
  formContext: PropTypes.object,
  id: PropTypes.string,
  multiple: PropTypes.string,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool,
  formData: PropTypes.object,
  value: PropTypes.object,
  options: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.draftItem.get("formData"),
});

export default connect(mapStateToProps, null)(SelectWidget);
