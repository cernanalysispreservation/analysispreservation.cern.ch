import PropTypes from "prop-types";
import { Space, Typography, DatePicker } from "antd";
import FacetItem from "./FacetItem";
import RangeSlider from "./Slider";
// import RangeDate from "./RangeDate";
const { RangePicker } = DatePicker;

import queryString from "query-string";

import { withRouter } from "react-router-dom";

const Facet = ({
  category,
  facet,
  isAggSelected,
  selectedAggs,
  onChange,
  history,
}) => {
  const getContentByType = (type) => {
    const choices = {
      range: <RangeSlider items={facet.get(category)} category={category} />,
      daterange: (
        <RangePicker
          onChange={(d, ds) => {
            if (ds) {
              let params = queryString.parse(history.location.search);
              const location = {
                search: `${queryString.stringify(
                  Object.assign(params, {
                    [category]: `${ds[0]}--${ds[1]}`,
                  })
                )}`,
              };
              history.push(location);
            }
          }}
        />
      ),
      default: (
        <FacetItem
          limit={11}
          item={facet.getIn([category, "buckets"])}
          isAggSelected={isAggSelected}
          selectedAggs={selectedAggs}
          onChange={onChange}
          category={category}
        />
      ),
    };

    if (Object.keys(choices).indexOf(type) < 0) type = "default";

    return choices[type];
  };

  const getFacetTitle = (title) =>
    facet.hasIn([category, "meta", "title"])
      ? facet.getIn([category, "meta", "title"])
      : title.replace(/_/g, " ").replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

  return (
    <Space direction="vertical" style={{ width: "100%", marginBottom: "10px" }}>
      <Typography.Title level={5}>{getFacetTitle(category)}</Typography.Title>
      {getContentByType(
        facet.hasIn([category, "meta", "type"]) &&
          facet.getIn([category, "meta", "type"])
      )}
    </Space>
  );
};

Facet.propTypes = {
  category: PropTypes.string,
  facet: PropTypes.object,
  selectedAggs: PropTypes.object,
  onChange: PropTypes.func,
  isAggSelected: PropTypes.func,
};

export default withRouter(Facet);
