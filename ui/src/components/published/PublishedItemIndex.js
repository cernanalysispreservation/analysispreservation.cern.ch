import PropTypes from "prop-types";

import React from "react";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import { getPublishedItem } from "../../actions/published";

// import PublishedItem from '../published/PublishedItem';
import RerunPublished from "../published/RerunPublished";
import RunsIndex from "../published/RunsIndex";
// import RerunStatus from '../published/RerunStatus';
import PublishedPreview from "./PublishedPreview";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";
import PublishedSidebar from "./components/PublishedSidebar";

class PublishedItemIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { id } = this.props.match.params;
    this.props.getPublishedItem(id);
  }

  render() {
    return (
      <Box flex={true} direction="row">
        <Route exact path={`/published/:id`} component={PublishedPreview} />
        <Route exact path={`/published/:id/runs/`} component={RunsIndex} />
        <Route
          exact
          path={`/published/:id/runs/create`}
          component={RerunPublished}
        />
        <PublishedSidebar />
      </Box>
    );
  }
}

PublishedItemIndex.propTypes = {
  startDeposit: PropTypes.func
};

function mapStateToProps(state) {
  return {
    groups: state.auth.getIn(["currentUser", "depositGroups"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPublishedItem: id => dispatch(getPublishedItem(id))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PublishedItemIndex)
);
