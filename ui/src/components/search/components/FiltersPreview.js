import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

const FiltersPreview = function(props) {
  let { aggs } = props;
  let p = [];

  Object.keys(aggs).map(type => {
    if (aggs[type].map) {
      aggs[type].map(name =>
        p.push(
          <Box
            flex="shrink"
            pad="small"
            wrap={false}
            margin={{ right: "small" }}
            colorIndex="light-1"
          >
            {type} : {name}
          </Box>
        )
      );
    }
  });

  return (
    <Box pad="small">
      Filters
      <Box flex={true}>{JSON.stringify(aggs)}</Box>
    </Box>
  );
};

FiltersPreview.propTypes = {
  aggs: PropTypes.object
};

export default FiltersPreview;
