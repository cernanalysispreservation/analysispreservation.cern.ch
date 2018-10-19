import { Map, fromJS, List } from "immutable";

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

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case DASHBOARD_QUERY:
      return state.setIn(["results"], action.results);
    default:
      return state;
  }
}
