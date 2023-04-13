import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Slider } from "antd";
import queryString from "query-string";
import { withRouter } from "react-router-dom";

const RangeSlider = ({ items, category, history }) => {
  const { range } = useMemo(
    () => {
      let barChartData = {};
      let range = [];
      items.get("buckets").map(item => {
        barChartData[item.get("key_as_string")] = item.get("doc_count");
        range.push(new Date(item.get("key")).getFullYear());
      });

      // make sure the earlier date is first
      range.sort();

      return { range: [range[0], range[range.length - 1]] };
    },
    [items]
  );

  const [sliderRange, setSliderRange] = useState(range);

  const onChange = () => {
    let params = queryString.parse(history.location.search);

    const location = {
      search: `${queryString.stringify(
        Object.assign(params, {
          [category]: `${sliderRange[0]}--${sliderRange[1]}`,
        })
      )}`,
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
      marks={{
        [sliderRange[0]]: sliderRange[0],
        [sliderRange[1]]: sliderRange[1],
      }}
      disabled={range.length <= 1}
      value={[sliderRange[0], sliderRange[1]]}
      onAfterChange={onChange}
      onChange={setSliderRange}
      tooltip={{
        open: false,
      }}
    />
  );
};

RangeSlider.propTypes = {
  items: PropTypes.object,
  category: PropTypes.string,
  history: PropTypes.object,
};

export default withRouter(RangeSlider);
