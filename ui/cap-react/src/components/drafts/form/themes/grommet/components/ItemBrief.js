import React from "react";
import PropTypes from "prop-types";
import _get from "lodash/get";

import Box from "grommet/components/Box";

let ItemBrief = function(props) {
  const { item, label } = props;

  let preview = [];

  if (Array.isArray(label)) {
    label.map(prop => {
      preview.push(
        `${prop.title}${prop.separator || ":"} ${_get(item, prop.path) || "-"}`
      );
    });
  } else {
    preview = label;
  }

  return (
    <Box direction="row" justify="between">
      {preview}
    </Box>
  );
};

ItemBrief.propTypes = {
  label: PropTypes.string,
  item: PropTypes.object
};

export default ItemBrief;
