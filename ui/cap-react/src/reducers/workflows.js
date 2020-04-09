import { Map, fromJS } from "immutable";

import * as workflowActions from "../actions/workflows";

const initialState = Map({
  loading: false,
  error: null,
  list: fromJS([]),
  past_list: {},
  forRecord: {}
});

export default function workflowsReducer(state = initialState, action) {
  switch (action.type) {
    case workflowActions.WORKFLOWS_REQUEST:
      return state.set("loading", true);
    case workflowActions.WORKFLOWS_SUCCESS:
      return state.set("loading", false).set("list", fromJS(action.workflows));
    case workflowActions.WORKFLOWS_ERROR:
      return state.set("loading", false).set("errors", action.error);

    case workflowActions.WORKFLOWS_RECORD_REQUEST:
      return state;
    case workflowActions.WORKFLOWS_RECORD_SUCCESS:
      return state;
    case workflowActions.WORKFLOWS_RECORD_ERROR:
      return state;

    case workflowActions.WORKFLOW_REQUEST:
      return state.setIn(["items", action.workflow_id, "loading"], true);
    case workflowActions.WORKFLOW_SUCCESS:
      return state
        .mergeIn(["items", action.workflow_id], action.data)
        .setIn(["items", action.workflow_id, "loading"], false);
    case workflowActions.WORKFLOW_ERROR:
      return state
        .setIn(["items", action.workflow_id, "loading"], false)
        .setIn(["items", action.workflow_id, "error"], action.error);

    case workflowActions.WORKFLOW_CREATE_REQUEST:
      return state.set("loading", true);
    case workflowActions.WORKFLOW_CREATE_SUCCESS:
      return state;
    case workflowActions.WORKFLOW_CREATE_ERROR:
      return state;

    case workflowActions.WORKFLOW_DELETE_REQUEST:
      return state;
    case workflowActions.WORKFLOW_DELETE_SUCCESS:
      return state;
    case workflowActions.WORKFLOW_DELETE_ERROR:
      return state;

    case workflowActions.WORKFLOW_START_REQUEST:
      return state;
    case workflowActions.WORKFLOW_START_SUCCESS:
      return state;
    case workflowActions.WORKFLOW_START_ERROR:
      return state;

    case workflowActions.WORKFLOW_STOP_REQUEST:
      return state;
    case workflowActions.WORKFLOW_STOP_SUCCESS:
      return state;
    case workflowActions.WORKFLOW_STOP_ERROR:
      return state;

    case workflowActions.WORKFLOW_CLONE_REQUEST:
      return state;
    case workflowActions.WORKFLOW_CLONE_SUCCESS:
      return state;
    case workflowActions.WORKFLOW_CLONE_ERROR:
      return state;

    case workflowActions.WORKFLOW_STATUS_REQUEST:
      return state.setIn(["items", action.workflow_id, "loading"], true);
    case workflowActions.WORKFLOW_STATUS_SUCCESS:
      return state
        .setIn(["items", action.workflow_id, "loading"], false)
        .setIn(["items", action.workflow_id, "status"], fromJS(action.data));

    case workflowActions.WORKFLOW_STATUS_ERROR:
      return state
        .setIn(["items", action.workflow_id, "loading"], false)
        .setIn(["items", action.workflow_id, "error"], fromJS(action.error));
    case workflowActions.WORKFLOW_LOGS_REQUEST:
      return state;
    case workflowActions.WORKFLOW_LOGS_SUCCESS:
      return state;
    case workflowActions.WORKFLOW_LOGS_ERROR:
      return state;

    case workflowActions.WORKFLOW_FILES_REQUEST:
      return state;
    case workflowActions.WORKFLOW_FILES_SUCCESS:
      return state;
    case workflowActions.WORKFLOW_FILES_ERROR:
      return state;

    case workflowActions.WORKFLOW_FILE_UPLOAD_REQUEST:
      return state;
    case workflowActions.WORKFLOW_FILE_UPLOAD_SUCCESS:
      return state;
    case workflowActions.WORKFLOW_FILE_UPLOAD_ERROR:
      return state;

    case workflowActions.WORKFLOW_FILE_DELETE_REQUEST:
      return state;
    case workflowActions.WORKFLOW_FILE_DELETE_SUCCESS:
      return state;
    case workflowActions.WORKFLOW_FILE_DELETE_ERROR:
      return state;

    default:
      return state;
  }
}
