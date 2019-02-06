import { Map } from "immutable";

import { DASHBOARD_QUERY } from "../actions/dashboard";

const initialState = Map({
  results: {
    published_by_collab: [],
    shared_with_user: [],
    user_published: [],
    user_drafts: [],
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
