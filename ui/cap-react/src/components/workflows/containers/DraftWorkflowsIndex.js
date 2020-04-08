import { connect } from "react-redux";

import WorkflowsIndex from "../components/WorkflowsIndex";
import { getRecordWorkflows } from "../../../actions/workflows";

function mapStateToProps(state) {
  return {
    workflows: state.draftItem.get("workflows")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDraftWorkflows: pid => dispatch(getRecordWorkflows(pid))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsIndex);
