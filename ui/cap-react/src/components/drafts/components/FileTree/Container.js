import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

// import MiddleTruncate from 'react-middle-truncate';

const Container = ({ onSelect }) => {
  return (
    <Box
      onClick={onSelect}
      flex={true}
      wrap={false}
      justify="between"
      direction="row"
      pad="xsmall"
    />
  );
};

Container.propTypes = {
  onSelect: PropTypes.func
};

export default Container;
