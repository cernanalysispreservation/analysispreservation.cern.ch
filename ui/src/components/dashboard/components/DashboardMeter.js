import React from "react";

import AnnotatedMeter from "grommet-addons/components/AnnotatedMeter";

import Box from "grommet/components/Box";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

class DashboardMeter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { total, drafts, published } = this.props;
    return (
      <Box pad="large" flex={false} align="center">
        <AnnotatedMeter
          legend={true}
          type="circle"
          defaultMessage="Your"
          max={total}
          series={[
            {
              label: "Your Drafts",
              value: drafts,
              onClick: () => this.props.history.push("/drafts?q=&by_me=True"),
              colorIndex: "graph-1"
            },
            {
              label: "Published",
              value: published,
              onClick: () => this.props.history.push("/search?q=&by_me=True"),
              colorIndex: "graph-2"
            }
          ]}
        />
      </Box>
    );
  }
}

DashboardMeter.propTypes = {
  total: PropTypes.number,
  drafts: PropTypes.number,
  published: PropTypes.number,
  history: PropTypes.object
};

export default withRouter(DashboardMeter);
