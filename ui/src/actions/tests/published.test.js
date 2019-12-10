import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../published";
import axios from "axios";
import cogoToast from "cogo-toast";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Action Creators => Published", () => {
  it("Sync Published Item Request", () => {
    const action = {
      type: actions.PUBLISHED_ITEM_REQUEST
    };

    expect(actions.publishedItemRequest()).toEqual(action);
  });

  it("Sync Published Item Success", () => {
    const published = {};

    const action = {
      type: actions.PUBLISHED_ITEM_SUCCESS,
      published
    };

    expect(actions.publishedItemSuccess(published)).toEqual(action);
  });

  it("Sync Published Item Erro", () => {
    const error = {};

    const action = {
      type: actions.PUBLISHED_ITEM_ERROR,
      error
    };

    expect(actions.publishedItemError(error)).toEqual(action);
  });

  it("Async Get Published Item", async () => {
    const id = "CAP.ALICE.G1I0.Y0L8";
    const data = {
      id: "CAP.ALICE.G1I0.Y0L8",
      access: {},
      can_admin: true,
      can_update: true,
      created: "2020-01-14T09:08:19.245891+00:00",
      created_by: "info@inveniosoftware.org",
      experiment: "ALICE",
      files: [],
      is_owner: true,
      links: {},
      metadata: {},
      revision: 1,
      schema: {},
      schemas: {},
      status: "draft",
      type: "deposit",
      updated: "2020-01-14T09:08:19.405158+00:00"
    };

    axios.get(url => {
      return Promise.resolve({
        data: data
      });
    });

    const expectedActions = [
      { type: actions.PUBLISHED_ITEM_REQUEST },
      { type: actions.PUBLISHED_ITEM_SUCCESS, data }
    ];

    const store = mockStore({});

    await store.dispatch(actions.getPublishedItem(id)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
