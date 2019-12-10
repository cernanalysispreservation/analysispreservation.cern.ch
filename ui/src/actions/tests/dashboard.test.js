import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../dashboard";
import axios from "axios";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Actions => Dashboard", () => {
  it("Sync Dashboard Query Request", () => {
    const expectedAction = {
      type: actions.DASHBOARD_QUERY_REQUEST
    };

    expect(actions.dashboardQueryRequest()).toEqual(expectedAction);
  });

  it("Sync Dashboard Query Success", () => {
    const results = {
      drafts: {},
      published: {},
      user_count: 45,
      user_drafts: {},
      user_drafts_count: 12,
      user_published: {},
      user_published_count: 12,
      user_workflows: {}
    };
    const expectedAction = {
      type: actions.DASHBOARD_QUERY,
      results
    };

    expect(actions.dashboardQuerySuccess(results)).toEqual(expectedAction);
  });

  it("Sync Dashboard Query Error", () => {
    const error = {};
    const expectedAction = {
      type: actions.DASHBOARD_QUERY_ERROR,
      error
    };

    expect(actions.dashboardQueryError(error)).toEqual(expectedAction);
  });

  it("Async Fetch Dashboard", async () => {
    const results = {
      drafts: {},
      published: {},
      user_count: 45,
      user_drafts: {},
      user_drafts_count: 12,
      user_published: {},
      user_published_count: 12,
      user_workflows: {}
    };
    const expectedActions = [
      { type: actions.DASHBOARD_QUERY_REQUEST },
      { type: actions.DASHBOARD_QUERY, results }
    ];

    axios.get = jest.fn(url => {
      return Promise.resolve({
        data: results
      });
    });

    const store = mockStore({});
    await store.dispatch(actions.fetchDashboard()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("Async Failed Fetch Dashboard", async () => {
    const error = {};
    const expectedActions = [
      { type: actions.DASHBOARD_QUERY_REQUEST },
      { type: actions.DASHBOARD_QUERY_ERROR, error }
    ];

    axios.get = jest.fn(url => {
      return Promise.reject({});
    });

    const store = mockStore({});
    await store.dispatch(actions.fetchDashboard()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
