import { connect } from "react-redux";

import WorkflowsIndex from "../components/WorkflowsIndex";
import { getWorkflows } from "../../../actions/workflows";

function mapStateToProps(state) {
  return {
    workflows: state.workflows.get("list")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWorkflows: () => dispatch(getWorkflows())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsIndex);
