import PropTypes from "prop-types";

import React from "react";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import { getPublishedItem } from "../../actions/published";

import RerunPublished from "../published/RerunPublished";
import RunsIndex from "../published/RunsIndex";

import PublishedPreview from "./PublishedPreview";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";
import PublishedSidebar from "./components/PublishedSidebar";
import {
  PUBLISHED_PREVIEW,
  PUBLISHED_RUNS,
  PUBLISHED_RUNS_CREATE
} from "../Routes/paths";

class PublishedItemIndex extends React.Component {
  componentDidMount() {
    let { id } = this.props.match.params;
    this.props.getPublishedItem(id);
  }

  render() {
    return (
      <Box flex={true} direction="row">
        <Route exact path={PUBLISHED_PREVIEW} component={PublishedPreview} />
        {this.props.item &&
        this.props.item.metadata &&
        this.props.item.metadata.workflows &&
        this.props.item.metadata.workflows.length > 0 ? (
          <Route exact path={PUBLISHED_RUNS} component={RunsIndex} />
        ) : null}
        {this.props.item &&
        this.props.item.metadata &&
        this.props.item.metadata.workflows &&
        this.props.item.metadata.workflows.length > 0 ? (
          <Route
            exact
            path={PUBLISHED_RUNS_CREATE}
            component={RerunPublished}
          />
        ) : null}
        {this.props.item &&
        this.props.item.metadata &&
        this.props.item.metadata.workflows &&
        this.props.item.metadata.workflows.length > 0 ? (
          <PublishedSidebar />
        ) : null}
      </Box>
    );
  }
}

PublishedItemIndex.propTypes = {
  startDeposit: PropTypes.func,
  getPublishedItem: PropTypes.func,
  item: PropTypes.object,
  match: PropTypes.object
};

const mapStateToProps = state => {
  return {
    groups: state.auth.getIn(["currentUser", "depositGroups"]),
    item: state.published.getIn(["current_item", "data"])
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPublishedItem: id => dispatch(getPublishedItem(id))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PublishedItemIndex)
);
