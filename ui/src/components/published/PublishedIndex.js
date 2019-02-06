import PropTypes from "prop-types";

import React from "react";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import PublishedItemIndex from "./PublishedItemIndex";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";

class PublishedIndex extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <Route path={`/published/:id`} component={PublishedItemIndex} />
      </Box>
    );
  }
}

PublishedIndex.propTypes = {
  startDeposit: PropTypes.func
};

function mapStateToProps(state) {
  return {
    groups: state.auth.getIn(["currentUser", "depositGroups"])
  };
}

export default withRouter(connect(mapStateToProps)(PublishedIndex));
