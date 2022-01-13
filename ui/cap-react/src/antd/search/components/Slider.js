import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Slider } from "antd";
import queryString from "query-string";
import { withRouter } from "react-router-dom";

const RangeSlider = ({ items, category, history }) => {
  const { marks, range } = useMemo(
    () => {
      let total = 0;
      let barChartData = {};
      let range = [];
      items.buckets.map(item => {
        barChartData[item.key_as_string] = item.doc_count;
        total += item.doc_count;
        range.push(new Date(item.key).getFullYear());
      });
      const r = range[1] - range[0];
      const marks = {};
      Array.from(
        { length: r + 1 },
        (_, i) => (marks[range[0] + i] = range[0] + i)
      );
      return { total, barChartData, range, marks };
    },
    [items]
  );

  const [sliderRange, setSliderRange] = useState(range);

  const onChange = () => {
    let params = queryString.parse(history.location.search);

    const location = {
      search: `${queryString.stringify(
        Object.assign(params, {
          [category]: `${sliderRange[0]}--${sliderRange[1]}`
        })
      )}`
    };

    history.push(location);
  };

  useEffect(() => {
    let params = queryString.parse(history.location.search)[category];

    if (params) {
      let values = params.split("--");
      setSliderRange([Number(values[0]), Number(values[1])]);
    }
  }, []);

  return (
    <Slider
      min={range[0]}
      max={range[1]}
      range
      defaultValue={range}
      marks={marks}
      value={sliderRange}
      onAfterChange={onChange}
      onChange={setSliderRange}
    />
  );
};

RangeSlider.propTypes = {
  items: PropTypes.object,
  category: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(RangeSlider);
