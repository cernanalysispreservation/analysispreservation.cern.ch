import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

import WorkflowsIndex from "./containers/WorkflowsIndex";
import WorkflowsItem from "./containers/WorkflowsItem";
import WorkflowsCreate from "./containers/WorkflowsCreate";

import DraftWorkflowsIndex from "./containers/DraftWorkflowsIndex";
import DraftWorkflowsItem from "./containers/DraftWorkflowsItem";
import DraftWorkflowsCreate from "./containers/DraftWorkflowsCreate";

import NotFoundPage from "../errors/404";

class WorkflowsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { match: { path, params = {} } = {} } = this.props;

    let _WorkflowsIndex, _WorkflowsItem, _WorkflowsCreate;
    if (params.draft_id) {
      _WorkflowsIndex = DraftWorkflowsIndex;
      _WorkflowsItem = DraftWorkflowsItem;
      _WorkflowsCreate = DraftWorkflowsCreate;
    } else {
      _WorkflowsIndex = WorkflowsIndex;
      _WorkflowsItem = WorkflowsItem;
      _WorkflowsCreate = WorkflowsCreate;
    }
    return (
      <Box flex={true} pad="medium" alignSelf="center">
        <Box flex="grow" size={{ width: { max: "xxlarge" } }}>
          <Switch>
            <Route exact path={`${path}`} component={_WorkflowsIndex} />
            <Route path={`${path}/create`} component={_WorkflowsCreate} />
            <Route path={`${path}/:workflow_id`} component={_WorkflowsItem} />
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
