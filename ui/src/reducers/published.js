import { Map } from "immutable";

import {
  FETCH_SCHEMA_REQUEST,
  FETCH_SCHEMA_SUCCESS,
  FETCH_SCHEMA_ERROR
} from "../actions/common";

import {
  PUBLISHED_ITEM_REQUEST,
  PUBLISHED_ITEM_SUCCESS,
  PUBLISHED_ITEM_ERROR
} from "../actions/published";

const initialState = Map({
  id: null,
  data: null,
  schema: null,
  uiSchema: null,
  loading: false,
  error: null,
  files: Map({})
});

export default function publishedReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SCHEMA_REQUEST:
      return state.set("loading", true).set("error", false);
    case FETCH_SCHEMA_SUCCESS:
      return state
        .set("loading", false)
        .set("schema", action.schema.schema)
        .set("uiSchema", action.schema.uiSchema);
    case FETCH_SCHEMA_ERROR:
      return state.set("loading", false).set("error", action.error);
    case PUBLISHED_ITEM_REQUEST:
      return state.set("loading", true).set("error", false);
    case PUBLISHED_ITEM_SUCCESS:
      return state
        .set("loading", false)
        .merge(action.published)
        .set(
          "files",
          action.published.files.length > 0
            ? Map(action.published.files.map(item => [item.key, item]))
            : Map({})
        );
    case PUBLISHED_ITEM_ERROR:
      return state.set("loading", false).set("error", action.error);
    default:
      return state;
  }
}
