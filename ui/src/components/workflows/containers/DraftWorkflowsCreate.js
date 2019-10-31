import { connect } from "react-redux";

import WorkflowsCreate from "../components/WorkflowsCreate";
import {
  getWorkflowStatus,
  startWorkflow,
  stopWorkflow,
  createWorkflow
} from "../../../actions/workflows";

function mapStateToProps(state, props) {
  let { workflow_id } = props.match.params;
  return {
    workflow: state.draftItem.getIn(["workflows", "items", workflow_id]),
    status: state.draftItem.getIn(["workflows", "items", workflow_id, "status"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWorkflowStatus: workflow_id => dispatch(getWorkflowStatus(workflow_id)),
    createWorkflow: data => dispatch(createWorkflow(data)),
    startWorkflow: workflow_id => dispatch(startWorkflow(workflow_id)),
    stopWorkflow: workflow_id => dispatch(stopWorkflow(workflow_id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsCreate);
