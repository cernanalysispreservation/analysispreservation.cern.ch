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

class PublishedItemIndex extends React.Component {
  componentDidMount() {
    let { id } = this.props.match.params;
    this.props.getPublishedItem(id);
  }

  _discoverSchema = schema => {
    if (schema) {
      let ana_type = schema.split("-v")[0];
      let type = ana_type.split("/");
      ana_type = type[type.length - 1];

      return ana_type;
    }
    return null;
  };

  render() {
    let ana_type = this.props.published
      ? this._discoverSchema(this.props.published.schema)
      : null;

    return (
      <Box flex={true} direction="row">
        <Route exact path={`/published/:id`} component={PublishedPreview} />
        <Route exact path={`/published/:id/runs/`} component={RunsIndex} />
        <Route
          exact
          path={`/published/:id/runs/create`}
          component={RerunPublished}
        />
        {ana_type == "atlas-analysis" ? <PublishedSidebar /> : null}
      </Box>
    );
  }
}

PublishedItemIndex.propTypes = {
  startDeposit: PropTypes.func
};

function mapStateToProps(state) {
  return {
    published: state.published.getIn(["current_item", "data"]),
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
