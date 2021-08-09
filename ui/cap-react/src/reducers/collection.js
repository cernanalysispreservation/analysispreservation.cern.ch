import { Map, fromJS } from "immutable";

import {
  FETCH_RECORDS_RESULTS_ERROR,
  FETCH_RECORDS_RESULTS_REQUEST,
  FETCH_RECORDS_RESULTS_SUCCESS
} from "../actions/common";

const initialState = Map({
  results: {
    drafts: {
      data: [],
      more: ""
    },
    user_drafts: {
      data: [],
      more: ""
    },
    published: {
      data: [],
      more: ""
    },
    user_published: {
      data: [],
      more: ""
    }
  },
  schema_data: Map({}),
  loading: false,
  error: null
});

export default function collectionReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_RECORDS_RESULTS_REQUEST:
      return state.set("loading", true).set("error", null);
    case FETCH_RECORDS_RESULTS_SUCCESS:
      return state
        .set("loading", false)
        .set("error", null)
        .set("results", action.rest)
        .set("schema_data", fromJS(action.schema_data));
    case FETCH_RECORDS_RESULTS_ERROR:
      return initialState.set("error", action.payload);
    default:
      return state;
  }
}
