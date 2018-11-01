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
  hasRemove: PropTypes.bool,
  hasMoveDown: PropTypes.bool,
  hasMoveUp: PropTypes.bool,
  onDropIndexClick: PropTypes.func,
  onReorderClick: PropTypes.func,
  index: PropTypes.string,
  item: PropTypes.object,
  label: PropTypes.string
};

export default ItemBrief;
