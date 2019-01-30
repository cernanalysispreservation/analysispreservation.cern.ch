import { Map } from "immutable";

import {
  FETCH_SCHEMA_REQUEST,
  FETCH_SCHEMA_SUCCESS,
  FETCH_SCHEMA_ERROR
} from "../actions/common";

import {
  PUBLISHED_REQUEST,
  PUBLISHED_SUCCESS,
  PUBLISHED_ERROR,
  PUBLISHED_ITEM_REQUEST,
  PUBLISHED_ITEM_SUCCESS,
  PUBLISHED_ITEM_ERROR,
  RERUN_STATUS_REQUEST,
  RERUN_STATUS_SUCCESS,
  RERUN_STATUS_ERROR,
  RERUN_CREATE_WORKFLOW_SUCCESS,
  RERUN_GET_WORKFLOWS_REQUEST,
  RERUN_GET_WORKFLOWS_SUCCESS,
  RERUN_GET_WORKFLOWS_ERROR
} from "../actions/published";

const initialState = Map({
  results: {},
  loading: false,
  error: null,
  current_item: Map({
    id: null,
    data: null,
    schema: null,
    uiSchema: null,
    loading: false,
    error: null
  }),
  runs: Map(),
  status: Map(),
  current_run: Map({
    id: null,
    data: null,
    loading: false,
    error: null,
    outputs: null
  })
});
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function publishedReducer(state = initialState, action) {
  switch (action.type) {
    case PUBLISHED_REQUEST:
      return state;
    case PUBLISHED_SUCCESS:
      return state;
    case PUBLISHED_ERROR:
      return state;
    case FETCH_SCHEMA_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], false);
    case FETCH_SCHEMA_SUCCESS:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "schema"], action.schema.schema)
        .setIn(["current_item", "uiSchema"], action.schema.uiSchema);
    case FETCH_SCHEMA_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case PUBLISHED_ITEM_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], false);
    case PUBLISHED_ITEM_SUCCESS:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "data"], action.published);
    case PUBLISHED_ITEM_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case RERUN_STATUS_REQUEST:
      return state.setIn(["current_run", "loading"], true);
    case RERUN_STATUS_SUCCESS:
      return state.setIn(["status", action.workflow_id], action.data);
    case RERUN_STATUS_ERROR:
      return state
        .setIn(["current_run", "loading"], false)
        .setIn(["current_run", "error"], action.error);
    case RERUN_CREATE_WORKFLOW_SUCCESS:
      return state.setIn(["runs", action.data.workflow_id], action.data);
    case RERUN_GET_WORKFLOWS_REQUEST:
      return state;
    case RERUN_GET_WORKFLOWS_SUCCESS:
      return state.setIn(["runs"], Map(action.data));
    case RERUN_GET_WORKFLOWS_ERROR:
      return state;
    default:
      return state;
  }
}
