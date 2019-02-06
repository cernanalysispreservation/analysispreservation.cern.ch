import { Map } from "immutable";

import {
  // WORKFLOW_STATUS_REQUEST,
  // WORKFLOW_STATUS_SUCCESS,
  // WORKFLOW_STATUS_ERROR,
  CREATE_WORKFLOW_REQUEST,
  CREATE_WORKFLOW_SUCCESS,
  CREATE_WORKFLOW_ERROR,
  GET_WORKFLOWS_REQUEST,
  GET_WORKFLOWS_SUCCESS,
  GET_WORKFLOWS_ERROR
} from "../actions/workflows";

const initialState = Map({
  loading: false,
  error: null,
  runs: {}
});

export default function workflowsReducer(state = initialState, action) {
  switch (action.type) {
    // case WORKFLOW_STATUS_REQUEST:
    //   return state.set("loading", true)
    //               .set("error", null);
    // case WORKFLOW_STATUS_SUCCESS:
    //   return state.setIn(["status", action.workflow_id], action.data);
    // case WORKFLOW_STATUS_ERROR:
    //   return state.set("loading", false)
    //               .set("error", action.error);
    case CREATE_WORKFLOW_REQUEST:
      return state.set("loading", true).set("error", null);
    case CREATE_WORKFLOW_SUCCESS:
      return state.set("runs", {}); // To be changed if we need to return message or info
    case CREATE_WORKFLOW_ERROR:
      return state.set("loading", false).set("error", action.error);
    case GET_WORKFLOWS_REQUEST:
      return state.set("loading", true).set("error", null);
    case GET_WORKFLOWS_SUCCESS:
      return state.set("runs", action.data);
    case GET_WORKFLOWS_ERROR:
      return state.set("loading", false).set("error", action.error);
    default:
      return state;
  }
}
