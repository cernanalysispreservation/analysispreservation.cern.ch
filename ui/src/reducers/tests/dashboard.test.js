import * as actions from "../../actions/dashboard";
import dashboard from "../dashboard";
import { Map } from "immutable";

const initialState = Map({
  loading: false,
  error: null,
  results: {
    drafts: { data: [], more: null },
    published: { data: [], more: null },
    user_published: { data: [], more: null },
    user_drafts: { data: [], more: null },
    user_workflows: { data: [], more: null },
    user_drafts_count: 0,
    user_published_count: 0,
    user_count: 0
  }
});

const loadingState = Map({
  loading: true,
  error: null,
  results: {
    drafts: { data: [], more: null },
    published: { data: [], more: null },
    user_published: { data: [], more: null },
    user_drafts: { data: [], more: null },
    user_workflows: { data: [], more: null },
    user_drafts_count: 0,
    user_published_count: 0,
    user_count: 0
  }
});
const results = {
  drafts: { data: ["1", "2"], more: null },
  published: { data: ["3", "4"], more: null },
  user_published: { data: ["2", "2"], more: null },
  user_drafts: { data: [], more: null },
  user_workflows: { data: [], more: null },
  user_drafts_count: 2,
  user_published_count: 2,
  user_count: 2
};
const error = {
  message: "errorMessage"
};
const errorState = Map({
  loading: false,
  error: error,
  results: {
    drafts: { data: [], more: null },
    published: { data: [], more: null },
    user_published: { data: [], more: null },
    user_drafts: { data: [], more: null },
    user_workflows: { data: [], more: null },
    user_drafts_count: 0,
    user_published_count: 0,
    user_count: 0
  }
});
const updatedState = Map({
  loading: false,
  error: null,
  results: results
});

describe("Dashboard Reducer Tests", () => {
  it("Should return the empty state", () => {
    expect(dashboard(undefined, {})).toEqual(initialState);
  });

  it("Send the request and enable loading", () => {
    const action = {
      type: actions.DASHBOARD_QUERY_REQUEST
    };
    expect(dashboard(initialState, action)).toEqual(loadingState);
  });

  it("Update the results ", () => {
    const action = {
      type: actions.DASHBOARD_QUERY,
      results
    };

    expect(dashboard(initialState, action)).toEqual(updatedState);
  });

  it("Set the error", () => {
    const action = {
      type: actions.DASHBOARD_QUERY_ERROR,
      error
    };

    expect(dashboard(initialState, action)).toEqual(errorState);
  });
});
