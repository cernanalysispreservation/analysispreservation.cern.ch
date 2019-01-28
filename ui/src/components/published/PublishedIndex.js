import PropTypes from "prop-types";

import React from "react";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

// import PublishedItem from '../published/PublishedItem';
import RerunPublished from "../published/RerunPublished";
// import RerunStatus from '../published/RerunStatus';
import PublishedItemIndex from "./PublishedItemIndex";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";

class PublishedIndex extends React.Component {
  constructor(props) {
    super(props);
  }

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

function mapDispatchToProps() {
  return {};
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PublishedIndex)
);
