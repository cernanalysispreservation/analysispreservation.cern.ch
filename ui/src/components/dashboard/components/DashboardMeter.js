import React from "react";

import AnnotatedMeter from "grommet-addons/components/AnnotatedMeter";

import Box from "grommet/components/Box";

class DashboardMeter extends React.Component {
  render() {
    const { total, drafts, published } = this.props;
    return (
      <Box pad="small" flex={false} align="center">
        <AnnotatedMeter
          legend={true}
          type="circle"
          defaultMessage="Your"
          max={total}
          series={[
            {
              label: "Your Drafts",
              value: drafts,
              colorIndex: "graph-1"
            },
            {
              label: "Published",
              value: published,
              colorIndex: "graph-2"
            }
          ]}
        />
      </Box>
    );
  }
}

export default DashboardMeter;
