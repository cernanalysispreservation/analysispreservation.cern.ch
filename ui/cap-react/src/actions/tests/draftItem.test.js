import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../draftItem";
import * as commonActions from "../common";
import axios from "axios";
import { Map } from "immutable";
import { act } from "react-dom/test-utils";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const draft_id = "ca91ce9758c748a4b115ffdd706f2cda";
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
    general_title: new_title,
  },
  revision: 1,
  schema: {},
  schemas: {},
  status: "draft",
  type: "deposit",
  updated: "2020-03-25T11:29:11.735378+00:00",
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
    general_title: new_title,
  },
  revision: 1,
  schema: {},
  schemas: {},
  status: "draft",
  type: "deposit",
  updated: "2020-03-25T11:29:11.735378+00:00",
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
    general_title: "this is another title",
  },
  revision: 1,
  schema: {},
  schemas: {},
  status: "draft",
  type: "deposit",
  updated: "2020-03-25T11:29:11.735378+00:00",
};

// this id is used from the toast mechanism in order to append the messages
document.body.innerHTML = "<div id='ct-container'>" + "</div>";
describe("Action Creators => draftItem", () => {
  it("Async Patch General Title Success", async () => {
    const expectedActions = [
      { type: actions.GENERAL_TITLE_REQUEST },
      { type: actions.GENERAL_TITLE_SUCCESS, draft },
    ];

    axios.patch = jest.fn(() => {
      return Promise.resolve({
        status: 200,
        data: response_data,
      });
    });

    const store = mockStore({
      draftItem: Map({
        metadata: {
          general_title: "this is my old title",
        },
      }),
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
      { type: actions.GENERAL_TITLE_SUCCESS, draft },
    ];

    axios.patch = jest.fn(() => {
      return Promise.resolve({
        status: 200,
        data: response_data_edit,
      });
    });

    const store = mockStore({
      draftItem: Map({
        metadata: {
          general_title: "this is my old title",
        },
      }),
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
      { type: actions.GENERAL_TITLE_ERROR, error },
    ];

    axios.patch = jest.fn(() => {
      return Promise.reject({
        error: undefined,
      });
    });

    const store = mockStore({
      draftItem: Map({
        metadata: {
          general_title: "this is an old title",
        },
      }),
    });

    await store
      .dispatch(actions.patchGeneralTitle(draft_id, new_title))
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("Async Create Draft Success", async () => {
    const expectedActions = [
      { type: actions.CREATE_DRAFT_REQUEST },
      { type: actions.CREATE_DRAFT_SUCCESS, draft },
    ];

    axios.post = jest.fn(() => {
      return Promise.resolve({
        data: draft,
      });
    });

    const store = mockStore({
      draftItem: Map({}),
    });

    await store
      .dispatch(
        actions.postCreateDraft(
          { general_title: new_title, $ana_type: "cms-analysis" },
          { name: "cms-analysis" }
        )
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("Async Create Draft Error", async () => {
    const expectedActions = [
      { type: actions.CREATE_DRAFT_REQUEST },
      {
        type: actions.CREATE_DRAFT_ERROR,
      },
    ];

    axios.post = jest.fn(() => {
      return Promise.reject({
        response: {
          data: { message: "This is an error message for the create process" },
        },
      });
    });
    const store = mockStore({
      draftItem: Map({}),
    });

    await store
      .dispatch(
        actions.postCreateDraft(
          { general_title: new_title, $ana_type: "cms-analysis" },
          { name: "cms-analysis" }
        )
      )
      .catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("Async Publish Draft Success", async () => {
    document.body.append = "";
    const expectedActions = [
      { type: actions.PUBLISH_DRAFT_REQUEST },
      { type: actions.PUBLISH_DRAFT_SUCCESS, draft },
    ];

    axios.post = jest.fn(() => {
      return Promise.resolve({
        data: draft,
      });
    });

    const store = mockStore({
      draftItem: Map({
        links: {
          publish:
            "http://localhost:3000/deposits/ff517e86453646adab77144c18933717/actions/publish",
        },
      }),
    });

    await act(async () => {
      await store.dispatch(actions.postPublishDraft()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  it("Async Publish Draft Error", async () => {
    const expectedActions = [{ type: actions.PUBLISH_DRAFT_REQUEST }];

    axios.post = jest.fn(() => {
      return Promise.reject({
        error: "this is the error from the publish draft",
      });
    });
    const store = mockStore({
      draftItem: Map({
        links: {
          publish:
            "http://localhost:3000/deposits/ff517e86453646adab77144c18933717/actions/publish",
        },
      }),
    });

    await act(async () => {
      await store.dispatch(actions.postPublishDraft()).catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  it("Async Publish Draft Validation Error", async () => {
    const expectedActions = [
      { type: actions.PUBLISH_DRAFT_REQUEST },
      {
        type: commonActions.FORM_ERRORS,
        errors: ["root_basic_info_cadi_id"],
      },
    ];

    axios.post = jest.fn(() => {
      return Promise.reject({
        response: {
          status: 422,
          data: {
            message: "Validation error. Try again with valid data",
            errors: [
              {
                field: ["basic_info", "cadi_id"],
                message: "'cadi_id' is a required property",
              },
            ],
          },
        },
      });
    });
    const store = mockStore({
      draftItem: Map({
        links: {
          publish:
            "http://localhost:3000/deposits/ff517e86453646adab77144c18933717/actions/publish",
        },
      }),
    });

    await act(async () => {
      await store.dispatch(actions.postPublishDraft()).catch(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
