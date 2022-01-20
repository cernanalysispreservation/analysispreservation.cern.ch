import React from "react";
import PropTypes from "prop-types";
import { Space, Typography } from "antd";
import FacetItem from "./FacetItem";
import RangeSlider from "./Slider";


const Facet = ({ category, facets, isAggSelected, selectedAggs, onChange }) => {
  const getContentByType = type => {
    const choices = {
      true: <RangeSlider items={facets[category]} category={category} />,
      false: (
        <FacetItem
          limit={11}
          items={facets[category].buckets}
          isAggSelected={isAggSelected}
          selectedAggs={selectedAggs}
          onChange={onChange}
          category={category}
        />
      )
    };

    return choices[type == "range"];
  };

  const getFacetTitle = title =>
    facets[category].meta && facets[category].meta.title
            ? facets[category].meta.title
            : title.replace(/_/g, " ").replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
              });

  return (
    <Space direction="vertical" style={{ width: "100%", marginBottom: "10px" }}>
      <Typography.Title level={5}>{getFacetTitle(category)}</Typography.Title>
      {getContentByType(facets[category].meta && facets[category].meta.type)}
    </Space>
  );
};

Facet.propTypes = {
  category: PropTypes.string,
  facets: PropTypes.object,
  selectedAggs: PropTypes.object,
  onChange: PropTypes.func,
  isAggSelected: PropTypes.func
};

export default Facet;
