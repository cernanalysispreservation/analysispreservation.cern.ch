import { Map } from "immutable";

import {
  SCHEMAS_LIST_REQUEST,
  SCHEMAS_LIST_SUCCESS,
  SCHEMAS_LIST_ERROR,
  SCHEMAS_ITEM_REQUEST,
  SCHEMAS_ITEM_SUCCESS,
  SCHEMAS_ITEM_UPDATE,
  SCHEMAS_ITEM_ERROR
} from "../actions/schemas";

const initialState = Map({
  list: Map({
    loading: false,
    data: [],
    error: null
  }),
  items: Map()
});

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function schemaReducer(state = initialState, action) {
  switch (action.type) {
    case SCHEMAS_LIST_REQUEST:
      return state.setIn(["list", "loading"], true);
    case SCHEMAS_LIST_SUCCESS:
      return state.setIn(["list", "data"], action.schemas);
    case SCHEMAS_LIST_ERROR:
      return state.setIn(["list", "error"], action.error);
    case SCHEMAS_ITEM_REQUEST:
      return state.setIn(["items", action.path, "loading"], true);
    case SCHEMAS_ITEM_SUCCESS:
      return state
        .setIn(["items", action.path, "original"], Map(action.data))
        .setIn(["items", action.path, "updated"], Map(action.data));
    case SCHEMAS_ITEM_UPDATE:
      return state.setIn(
        ["items", action.path, "updated", action.schema_type],
        action.data
      );
    case SCHEMAS_ITEM_ERROR:
      return state.setIn(["items", action.path, "error"], action.error);
    default:
      return state;
  }
}
