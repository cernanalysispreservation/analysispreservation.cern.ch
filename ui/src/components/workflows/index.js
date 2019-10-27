import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

import WorkflowsIndex from "./containers/WorkflowsIndex";
import WorkflowsItem from "./containers/WorkflowsItem";
import WorkflowsCreate from "./containers/WorkflowsCreate";

import NotFoundPage from "../errors/404";

class WorkflowsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={true} pad="medium" alignSelf="center">
        <Box flex="grow" size="xlarge">
          <Switch>
            <Route exact path="/workflows" component={WorkflowsIndex} />
            <Route path="/workflows/create" component={WorkflowsCreate} />
            <Route path="/workflows/:workflow_id" component={WorkflowsItem} />
            <Route component={NotFoundPage} />
          </Switch>
        </Box>
      </Box>
    );
  }
}

WorkflowsPage.propTypes = {
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
  match: PropTypes.object
};

function mapStateToProps(state) {
  return {};
}

export default withRouter(connect(mapStateToProps)(WorkflowsPage));
