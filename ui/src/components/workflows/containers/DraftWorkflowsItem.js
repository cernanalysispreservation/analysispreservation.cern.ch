import { connect } from "react-redux";

import WorkflowsItem from "../components/WorkflowItem";
import {
  createWorkflow,
  getWorkflowStatus,
  getWorkflowFiles,
  getRecordWorkflow,
  startWorkflow,
  stopWorkflow,
  uploadWorkflowFiles
} from "../../../actions/workflows";

import { toggleFilemanagerLayer } from "../../../actions/draftItem";

function mapStateToProps(state, props) {
  let { workflow_id } = props.match.params;
  return {
    workflows: state.draftItem.toJS(),
    workflow: state.draftItem.getIn(["workflows_items", workflow_id]),
    status: state.draftItem.getIn(["workflows_items", workflow_id, "status"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createWorkflow: (json_spec, pid) =>
      dispatch(createWorkflow(json_spec, pid)),
    getWorkflow: workflow_id => dispatch(getRecordWorkflow(workflow_id)),
    getWorkflowStatus: workflow_id => dispatch(getWorkflowStatus(workflow_id)),
    getWorkflowFiles: workflow_id => dispatch(getWorkflowFiles(workflow_id)),
    uploadWorkflowFiles: (workflow_id, data) =>
      dispatch(uploadWorkflowFiles(workflow_id, data)),
    startWorkflow: workflow_id => dispatch(startWorkflow(workflow_id)),
    stopWorkflow: workflow_id => dispatch(stopWorkflow(workflow_id)),
    toggleFilemanagerLayer: (selectable = false, action) =>
      dispatch(toggleFilemanagerLayer(selectable, action))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowsItem);
