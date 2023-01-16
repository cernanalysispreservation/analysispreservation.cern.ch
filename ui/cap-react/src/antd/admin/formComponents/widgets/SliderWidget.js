import React, { useState } from "react";
import PropTypes from "prop-types";
import { Slider } from "antd";

const SliderWidget = ({ schema, onChange }) => {
  const { defaultValue, values, labels } = schema;

  const [marks] = useState(() => {
    const m = {};
    labels.forEach((l, i) => (m[i] = l));
    return m;
  });

  const handleChange = event => {
    onChange(values[event]);
  };

  return (
    <Slider
      marks={marks}
      defaultValue={defaultValue}
      step={null}
      min={0}
      max={Object.keys(marks).length - 1}
      tooltipVisible={false}
      onChange={handleChange}
    />
  );
};

SliderWidget.propTypes = {
  schema: PropTypes.object,
  onChange: PropTypes.func,
};

export default SliderWidget;
