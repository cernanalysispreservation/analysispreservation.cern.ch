import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

const GRID_COLUMNS_OPTIONS = [
  { label: "25%", value: 6 },
  { label: "33%", value: 8 },
  { label: "50%", value: 12 },
  { label: "66%", value: 16 },
  { label: "75%", value: 18 },
  { label: "100%", value: 24 },
];

const SelectColumnsWidget = ({ value = 24, onChange }) => {
  return (
    <Select
      placeholder="Select width"
      value={value}
      options={GRID_COLUMNS_OPTIONS}
      onSelect={val => onChange(val)}
    />
  );
};

SelectColumnsWidget.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default SelectColumnsWidget;
