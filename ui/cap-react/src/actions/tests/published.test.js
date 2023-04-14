import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../published";
import axios from "axios";
import { Map } from "immutable";
import { describe, test, expect, vi } from "vitest";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const ID = "CAP.TEST.123";
const ERROR = {
  status: 400,
  data: "This is an error",
};
const DATA = {
  id: ID,
  schema: {
    fullname: "CMS",
  },
  can_review: false,
  created: "2021-08-31T12:47:22.090235+00:00",
  created_by: {
    email: "cap@cern.ch",
  },
  metadata: {
    general_title: "this is the general title",
  },
  status: "published",
  revision: 0,
  experiment: "CMS",
  is_owner: false,
  can_update: false,
  links: {},
  draft_id: "1234",
  loading: false,
};
const REVIEW = {
  body: "This is a great post",
  id: "123",
  resolved: false,
  reviewer: "cap@cern.ch",
  type: "approved",
};
describe("Published actions test suite", () => {
  test("Get Published item success", async () => {
    const expectedActions = [
      {
        type: actions.PUBLISHED_ITEM_REQUEST,
      },
      {
        type: actions.PUBLISHED_ITEM_SUCCESS,
        published: DATA,
      },
    ];

    axios.get = vi.fn(() => {
      return Promise.resolve({
        status: 200,
        data: DATA,
      });
    });

    const store = mockStore({
      published: Map({
        id: null,
        data: null,
        schema: null,
        uiSchema: null,
        loading: false,
        error: null,
        files: Map({}),
      }),
    });

    await store.dispatch(actions.getPublishedItem(ID)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test("Get Published item error", async () => {
    const expectedActions = [
      { type: actions.PUBLISHED_ITEM_REQUEST },
      {
        type: actions.PUBLISHED_ITEM_ERROR,
        error: ERROR,
      },
    ];

    axios.get = vi.fn(() => {
      return Promise.reject({
        response: {
          status: 400,
          error: ERROR,
        },
      });
    });

    const store = mockStore({
      published: Map({
        id: null,
        data: null,
        schema: null,
        uiSchema: null,
        loading: false,
        error: null,
        files: Map({}),
      }),
    });

    await store.dispatch(actions.getPublishedItem(ID)).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test("Review Published success", async () => {
    const expectedActions = [
      {
        type: actions.REVIEW_PUBISHED_REQUEST,
      },
      {
        type: actions.REVIEW_PUBISHED_SUCCESS,
        payload: REVIEW,
      },
    ];

    axios.post = vi.fn(() => {
      return Promise.resolve({
        status: 200,
        data: REVIEW,
      });
    });

    const store = mockStore({
      published: Map({
        id: ID,
        data: {},
        schema: {},
        uiSchema: {},
        loading: false,
        error: null,
        files: Map({}),
        links: {
          review:
            "http://localhost:3000/api/deposits/c8feb00afc1b41ada5be670e59734fa8/actions/review",
        },
      }),
    });

    await store.dispatch(actions.reviewPublished(REVIEW)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test("Review published item errror", async () => {
    const expectedActions = [
      { type: actions.REVIEW_PUBISHED_REQUEST },
      {
        type: actions.REVIEW_PUBISHED_ERROR,
        error: ERROR,
      },
    ];

    axios.post = vi.fn(() => {
      return Promise.reject({
        response: {
          status: 400,
          data: ERROR,
        },
      });
    });

    const store = mockStore({
      published: Map({
        id: ID,
        data: {},
        schema: {},
        uiSchema: {},
        loading: false,
        error: null,
        files: Map({}),
        links: {
          review:
            "http://localhost:3000/api/deposits/c8feb00afc1b41ada5be670e59734fa8/actions/review",
        },
      }),
    });

    await store.dispatch(actions.reviewPublished(REVIEW)).catch(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
