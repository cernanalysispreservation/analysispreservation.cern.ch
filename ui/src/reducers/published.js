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
  current_item: Map({
    id: null,
    data: null,
    schema: null,
    uiSchema: null,
    loading: false,
    error: null
  })
});

export default function publishedReducer(state = initialState, action) {
  switch (action.type) {
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
    default:
      return state;
  }
}
