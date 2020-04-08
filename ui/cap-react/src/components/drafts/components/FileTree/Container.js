import React from "react";

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

export default Container;
