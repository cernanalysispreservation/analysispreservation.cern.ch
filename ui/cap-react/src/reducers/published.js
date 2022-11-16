import { Map } from "immutable";

import {
  FETCH_SCHEMA_REQUEST,
  FETCH_SCHEMA_SUCCESS,
  FETCH_SCHEMA_ERROR,
} from "../actions/common";

import {
  PUBLISHED_ITEM_REQUEST,
  PUBLISHED_ITEM_SUCCESS,
  PUBLISHED_ITEM_ERROR,
  REVIEW_PUBISHED_ERROR,
  REVIEW_PUBISHED_REQUEST,
  REVIEW_PUBISHED_SUCCESS,
  INIT_STATE,
  CLEAR_REVIEW_PUBISHED_ERROR,
} from "../actions/published";

const initialState = Map({
  id: null,
  data: null,
  schema: null,
  uiSchema: null,
  loading: false,
  reviewLoading: false,
  reviewError: null,
  error: null,
  files: Map({}),
});

export default function publishedReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_STATE:
      return initialState;
    case FETCH_SCHEMA_REQUEST:
      return state.set("loading", true).set("error", null);
    case FETCH_SCHEMA_SUCCESS:
      return state
        .set("loading", false)
        .set("schema", action.schema.schema)
        .set("uiSchema", action.schema.uiSchema);
    case FETCH_SCHEMA_ERROR:
      return state.set("loading", false).set("error", action.error);
    case PUBLISHED_ITEM_REQUEST:
      return state.set("loading", true).set("error", null);
    case PUBLISHED_ITEM_SUCCESS:
      return state
        .set("loading", false)
        .merge(Map({ ...action.published }))
        .set(
          "files",
          action.published.files.length > 0
            ? Map(action.published.files.map((item) => [item.key, item]))
            : Map({})
        );
    case PUBLISHED_ITEM_ERROR:
      return state.set("loading", false).set("error", action.error);
    case REVIEW_PUBISHED_REQUEST:
      return state.set("reviewLoading", true).set("reviewError", null);
    case REVIEW_PUBISHED_SUCCESS:
      return state
        .set("reviewLoading", false)
        .set("review", action.payload.review);
    case CLEAR_REVIEW_PUBISHED_ERROR:
      return state.set("reviewError", null);
    case REVIEW_PUBISHED_ERROR:
      return state.set("reviewLoading", false).set("reviewError", action.error);
    default:
      return state;
  }
}
