import { Map, fromJS } from "immutable";

import {
  DASHBOARD_QUERY,
  DASHBOARD_QUERY_ERROR,
  DASHBOARD_QUERY_REQUEST
} from "../actions/dashboard";

const initialState = Map({
  loading: false,
  error: null,
  results: {
    drafts: { data: [], more: null },
    published: { data: [], more: null },
    user_published: { data: [], more: null },
    user_drafts: { data: [], more: null },
    user_drafts_count: 0,
    user_published_count: 0,
    user_count: 0
  }
});

export default function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case DASHBOARD_QUERY_REQUEST:
      return state.set("loading", true);
    case DASHBOARD_QUERY:
      return state.set("loading", false).set("results", action.results);
    case DASHBOARD_QUERY_ERROR:
      return state.set("loading", false).set("error", action.error);
    default:
      return state;
  }
}
