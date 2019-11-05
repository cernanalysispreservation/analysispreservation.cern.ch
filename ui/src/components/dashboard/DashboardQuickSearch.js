import React from "react";

import ReactTooltip from "react-tooltip";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

function DashboardQuickSearch() {
  return (
    <Box flex={false}>
      <Box pad="none">
        <Box flex={true} direction="row" pad="small" justify="between">
          <Heading
            tag="h5"
            uppercase={true}
            align="start"
            justify="center"
            margin="none"
            truncate={true}
          >
            Quick Search
          </Heading>
        </Box>
        <ReactTooltip />
      </Box>

      <Box flex={false} size={{ height: "medium" }} colorIndex="light-1" />
    </Box>
  );
}

export default DashboardQuickSearch;
