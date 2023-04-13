import { useState } from "react";
import PropTypes from "prop-types";
import { Slider } from "antd";

const SliderWidget = ({ schema, onChange, value }) => {
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
      defaultValue={
        values.indexOf(value) >= 0 ? values.indexOf(value) : defaultValue
      }
      step={null}
      min={0}
      max={Object.keys(marks).length - 1}
      onChange={handleChange}
      tooltip={{
        open: false,
      }}
    />
  );
};

SliderWidget.propTypes = {
  schema: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.number,
};

export default SliderWidget;
