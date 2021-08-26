import * as actions from "../../actions/dashboard";
import dashboardReducer from "../dashboard";
import { Map } from "immutable";

const ERROR_MESSAGE = "this is an error";
const RESULTS = {
  drafts: { data: [{ general_title: "One Draft" }], more: "drafts?q=" },
  published: { data: [{ general_title: "One Published" }], more: "search?q=" },
  user_published: {
    data: [{ general_title: "Yours Drafts" }],
    more: "/search?by_me=True"
  },
  user_drafts: {
    data: [{ general_title: "Yours Published" }],
    more: "/drafts?by_me=True&q="
  },
  user_workflows: { data: [], more: null },
  user_drafts_count: 1,
  user_published_count: 1,
  user_count: 1
};
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
const errorState = Map({
  loading: false,
  error: ERROR_MESSAGE,
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
const resultsState = Map({
  loading: false,
  error: null,
  results: {
    drafts: { data: [{ general_title: "One Draft" }], more: "drafts?q=" },
    published: {
      data: [{ general_title: "One Published" }],
      more: "search?q="
    },
    user_published: {
      data: [{ general_title: "Yours Drafts" }],
      more: "/search?by_me=True"
    },
    user_drafts: {
      data: [{ general_title: "Yours Published" }],
      more: "/drafts?by_me=True&q="
    },
    user_workflows: { data: [], more: null },
    user_drafts_count: 1,
    user_published_count: 1,
    user_count: 1
  }
});
describe("Dashboard Reducer Test", () => {
  it("Dashboard Request", () => {
    const action = {
      type: actions.DASHBOARD_QUERY_REQUEST
    };
    expect(dashboardReducer(initialState, action)).toEqual(loadingState);
    expect(dashboardReducer(initialState, action)).not.toEqual(initialState);
  });
  it("Dashboard Error", () => {
    const action = {
      type: actions.DASHBOARD_QUERY_ERROR,
      error: ERROR_MESSAGE
    };

    expect(dashboardReducer(initialState, action)).toEqual(errorState);
    expect(dashboardReducer(initialState, action)).not.toEqual(initialState);
    expect(dashboardReducer(initialState, action)).not.toEqual(loadingState);
  });
  it("Dashboard Success", () => {
    const action = {
      type: actions.DASHBOARD_QUERY,
      results: RESULTS
    };

    expect(dashboardReducer(initialState, action)).toEqual(resultsState);
    expect(dashboardReducer(initialState, action)).not.toEqual(errorState);
    expect(dashboardReducer(initialState, action)).not.toEqual(initialState);
  });
});
