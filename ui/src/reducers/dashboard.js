import { Map, fromJS } from "immutable";

import { DASHBOARD_QUERY } from "../actions/dashboard";

const initialState = Map({
  results: {
    published_by_collab: { data: [], more: null },
    shared_with_user: { data: [], more: null },
    user_published: { data: [], more: null },
    user_drafts: { data: [], more: null },
    user_drafts_count: 0,
    user_published_count: 0,
    user_count: 0
  }
});

export default function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case DASHBOARD_QUERY:
      return state.setIn(["results"], action.results);
    default:
      return state;
  }
}
