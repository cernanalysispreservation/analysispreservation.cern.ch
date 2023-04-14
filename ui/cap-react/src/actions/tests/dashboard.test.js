import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../dashboard";
import axios from "axios";
import { Map } from "immutable";
import { describe, expect, test, vi } from "vitest";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const fetchedResults = {
  drafts: {},
  published: {},
  user_published: {},
  user_drafts: {
    more: "/drafts?q=&by_me=True",
    data: [],
  },
  user_workflows: {
    more: "#",
  },
  user_drafts_acount: 5,
  user_count: 5,
};

const ERROR = "this is the error";

describe("Dashboard actions testing suite", () => {
  test("Fetch Dashboard Data Successfully", async () => {
    const expectedActions = [
      { type: actions.DASHBOARD_QUERY_REQUEST },
      {
        type: actions.DASHBOARD_QUERY,
        results: fetchedResults,
      },
    ];

    // mock the api call
    axios.get = vi.fn(() => {
      return Promise.resolve({
        status: 200,
        data: fetchedResults,
      });
    });

    const store = mockStore({
      dashboard: Map({
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
          user_count: 0,
        },
      }),
    });

    await store.dispatch(actions.fetchDashboard()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test("Fail to fetch dashboard", async () => {
    const expectedActions = [
      { type: actions.DASHBOARD_QUERY_REQUEST },
      { type: actions.DASHBOARD_QUERY_ERROR },
    ];

    axios.get = vi.fn(() => {
      return Promise.reject({
        error: ERROR,
      });
    });

    const store = mockStore({
      dashboard: Map({
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
          user_count: 0,
        },
      }),
    });

    await store.dispatch(actions.fetchDashboard()).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
