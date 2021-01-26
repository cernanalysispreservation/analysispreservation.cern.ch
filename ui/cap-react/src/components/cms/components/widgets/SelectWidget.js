import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const GRID_COLUMNS_OPTIONS = [
  { value: "1/2", label: "12" },
  { value: "1/3", label: "13" },
  { value: "1/4", label: "14" },
  { value: "1/5", label: "15" },
  { value: "2/3", label: "23" },
  { value: "2/4", label: "24" },
  { value: "2/5", label: "25" },
  { value: "3/4", label: "34" },
  { value: "3/5", label: "35" },
  { value: "4/5", label: "45" }
];

const SelectWidget = props => {
  return (
    <Select
      placeholder="Select position"
      menuPortalTarget={document.querySelector("#form_builder")}
      value={{
        value: props.value,
        label: (
          <img
            src={require(`../../../../img/field_layout_${
              props.value ? props.value.replace("/", "") : "15"
            }.png`)}
            style={{ width: "100%" }}
          />
        )
      }}
      options={GRID_COLUMNS_OPTIONS.map(column => {
        return {
          value: column.value,
          label: (
            <div onClick={() => props.onChange(column.value)}>
              <img
                src={require(`../../../../img/field_layout_${
                  column.label
                }.png`)}
                style={{ width: "100%" }}
              />
            </div>
          )
        };
      })}
    />
  );
};

SelectWidget.propTypes = {
  value: PropTypes.string
};

export default SelectWidget;
