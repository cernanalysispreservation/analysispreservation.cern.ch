import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../draftItem";
import axios from "axios";
import { Map } from "immutable";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const draft_id = "84c9818192bb4b4aaf366846f83d0dad";
const new_title = "This is the new Title";
const draft = {
  id: "ca91ce9758c748a4b115ffdd706f2cda",
  access: {},
  can_admin: true,
  can_update: true,
  created: "2020-03-25T11:01:01.163372+00:00",
  created_by: "info@inveniosoftware.org",
  experiment: "CMS",
  files: [],
  is_owner: true,
  links: {},
  metadata: {
    general_title: new_title
  },
  revision: 1,
  schema: {},
  schemas: {},
  status: "draft",
  type: "deposit",
  updated: "2020-03-25T11:29:11.735378+00:00"
};
const response_data = {
  id: "ca91ce9758c748a4b115ffdd706f2cda",
  access: {},
  can_admin: true,
  can_update: true,
  created: "2020-03-25T11:01:01.163372+00:00",
  created_by: "info@inveniosoftware.org",
  experiment: "CMS",
  files: [],
  is_owner: true,
  links: {},
  metadata: {
    general_title: new_title
  },
  revision: 1,
  schema: {},
  schemas: {},
  status: "draft",
  type: "deposit",
  updated: "2020-03-25T11:29:11.735378+00:00"
};
const response_data_edit = {
  id: "ca91ce9758c748a4b115ffdd706f2cda",
  access: {},
  can_admin: true,
  can_update: true,
  created: "2020-03-25T11:01:01.163372+00:00",
  created_by: "info@inveniosoftware.org",
  experiment: "CMS",
  files: [],
  is_owner: true,
  links: {},
  metadata: {
    general_title: "this is another title"
  },
  revision: 1,
  schema: {},
  schemas: {},
  status: "draft",
  type: "deposit",
  updated: "2020-03-25T11:29:11.735378+00:00"
};

describe("Action Creators => draftItem", () => {
  it("Async Patch General Title Success", async () => {
    const expectedActions = [
      { type: actions.GENERAL_TITLE_REQUEST },
      { type: actions.GENERAL_TITLE_SUCCESS, draft }
    ];

    axios.patch = jest.fn(() => {
      return Promise.resolve({
        status: 200,
        data: response_data
      });
    });

    const store = mockStore({
      draftItem: Map({
        metadata: {
          general_title: "this is my old title"
        }
      })
    });

    await store
      .dispatch(actions.patchGeneralTitle(draft_id, new_title))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
  it("Async Patch General Title Failed from Data", async () => {
    const expectedActions = [
      { type: actions.GENERAL_TITLE_REQUEST },
      { type: actions.GENERAL_TITLE_SUCCESS, draft }
    ];

    axios.patch = jest.fn(() => {
      return Promise.resolve({
        status: 200,
        data: response_data_edit
      });
    });

    const store = mockStore({
      draftItem: Map({
        metadata: {
          general_title: "this is my old title"
        }
      })
    });

    await store
      .dispatch(actions.patchGeneralTitle(draft_id, new_title))
      .then(() => {
        expect(store.getActions()).not.toEqual(expectedActions);
      });
  });
  it("Async Failed Patch General Title Error", async () => {
    const error = undefined;
    const expectedActions = [
      { type: actions.GENERAL_TITLE_REQUEST },
      { type: actions.GENERAL_TITLE_ERROR, error }
    ];

    axios.patch = jest.fn(() => {
      return Promise.reject({
        error: undefined
      });
    });

    const store = mockStore({
      draftItem: Map({
        metadata: {
          general_title: "this is an old title"
        }
      })
    });

    await store
      .dispatch(actions.patchGeneralTitle(draft_id, new_title))
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
