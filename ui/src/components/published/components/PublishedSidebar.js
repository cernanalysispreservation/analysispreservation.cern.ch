import React from "react";
import PropTypes from "prop-types";

import { withRouter } from "react-router";

import Box from "grommet/components/Box";

import CirclePlayIcon from "grommet/components/icons/base/CirclePlay";
import ResourcesIcon from "grommet/components/icons/base/Resources";

import Label from "grommet/components/Label";

class PublishedSidebar extends React.Component {
  render() {
    return (
      <Box align="end" flex={false} pad="small" colorIndex="light-2">
        <Box
          onClick={() =>
            this.props.history.push(
              `/published/${this.props.match.params.id}/runs/create`
            )
          }
          justify="center"
          align="center"
        >
          <CirclePlayIcon />
          <Label size="small">Run</Label>
        </Box>
        <br />
        <Box
          onClick={() =>
            this.props.history.push(
              `/published/${this.props.match.params.id}/runs`
            )
          }
          justify="center"
          align="center"
        >
          <ResourcesIcon />
          <Label size="small">Jobs</Label>
        </Box>
      </Box>
    );
  }
}

PublishedSidebar.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(PublishedSidebar);
