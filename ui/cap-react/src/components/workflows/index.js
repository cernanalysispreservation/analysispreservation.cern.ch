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

import { WORKFLOWS, WORKFLOWS_CREATE, WORKFLOWS_ITEM } from "../Routes/paths";

import NotFoundPage from "../errors/404";

class WorkflowsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { match: { params = {} } = {} } = this.props;

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
            <Route exact path={WORKFLOWS} component={_WorkflowsIndex} />
            <Route path={WORKFLOWS_CREATE} component={_WorkflowsCreate} />
            <Route path={WORKFLOWS_ITEM} component={_WorkflowsItem} />
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

function mapStateToProps() {
  return {};
}

export default withRouter(connect(mapStateToProps)(WorkflowsPage));
