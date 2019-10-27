import { connect } from "react-redux";

import WorkflowsItem from "../components/WorkflowItem";
import {
  createWorkflow,
  getWorkflow,
  getWorkflowStatus
} from "../../../actions/workflows";

function mapStateToProps(state, props) {
  let { workflow_id } = props.match.params;
  return {
    workflow: state.workflows.getIn(["items", workflow_id]),
    status: state.workflows.getIn(["items", workflow_id, "status"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createWorkflow: (json_spec, pid) =>
      dispatch(createWorkflow(json_spec, pid)),
    getWorkflow: workflow_id => dispatch(getWorkflow(workflow_id)),
    getWorkflowStatus: workflow_id => dispatch(getWorkflowStatus(workflow_id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsItem);
