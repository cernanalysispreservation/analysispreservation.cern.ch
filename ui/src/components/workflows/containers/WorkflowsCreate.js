import { connect } from "react-redux";

import WorkflowsCreate from "../components/WorkflowsCreate";
import { createWorkflow, getWorkflowStatus } from "../../../actions/workflows";

function mapStateToProps(state, props) {
  let { workflow_id } = props.match.params;
  return {
    status: state.workflows.getIn(["items", workflow_id, "status"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createWorkflow: (json_spec, pid) =>
      dispatch(createWorkflow(json_spec, pid)),
    getWorkflowStatus: workflow_id => dispatch(getWorkflowStatus(workflow_id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsCreate);
