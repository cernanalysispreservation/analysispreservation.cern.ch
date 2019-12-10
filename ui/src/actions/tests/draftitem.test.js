import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../draftItem";
import axios from "axios";
import { Map } from "immutable";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Action Creators => draftitem", () => {
  it("Async  Post Create Draft", async () => {
    const first_data = {
      general_title: "aaa",
      $ana_type: "alice-analysis"
    };
    const ana_type = {
      name: "alice-analysis"
    };
    const draft = {
      id: "1234",
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

    document.body.innerHTML = "<div id='ct-container'>" + "</div>";

    const expectedActions = [
      { type: actions.CREATE_DRAFT_REQUEST },
      { type: actions.CREATE_DRAFT_SUCCESS, draft }
    ];
    axios.post = jest.fn(url => {
      return Promise.resolve({
        data: draft
      });
    });
    const store = mockStore({});
    await store
      .dispatch(actions.postCreateDraft(first_data, ana_type))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("Async Patch General Title", async () => {
    const draft_id = "84c9818192bb4b4aaf366846f83d0dad";
    const title = "aaa";

    const draft = {
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

    const expectedActions = [
      { type: actions.GENERAL_TITLE_REQUEST },
      { type: actions.GENERAL_TITLE_SUCCESS, draft }
    ];

    axios.patch = jest.fn(url => {
      return Promise.resolve({
        status: 200,
        data: draft
      });
    });

    const store = mockStore({
      draftItem: Map({
        metadata: "ppppp",
        general_title: false
      })
    });

    await store
      .dispatch(actions.patchGeneralTitle(draft_id, title))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("Async Failed Patch General Title", async () => {
    const draft_id = "84c9818192bb4b4aaf366846f83d0dad";
    const title = "aaa";

    const patch_data = [
      {
        op: "add",
        path: "/general_title",
        value: "aaa"
      }
    ];

    const error = {};
    const expectedActions = [
      { type: actions.GENERAL_TITLE_REQUEST },
      { type: actions.GENERAL_TITLE_ERROR, error }
    ];

    axios.patch = jest.fn(url => {
      return Promise.reject({
        response: {}
      });
    });

    const store = mockStore({
      draftItem: Map({
        metadata: "ppppp",
        general_title: false
      })
    });

    await store
      .dispatch(actions.patchGeneralTitle(draft_id, title))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("Async Post And Put Published", async () => {
    const data = {
      $schema: undefined,
      basic_info: {
        analysis_title: "sa",
        glance_id: "aS"
      },
      glance_info: {
        gitlab_group: {}
      },
      input_datasets: [{}],
      likelihoods: {},
      limits: {},
      publications: []
    };
    const schema = undefined;
    const draft_id = "0191d936560b4b138082574a2e6b1410";

    const draft = {
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

    const expectedActions = [
      { type: actions.EDIT_PUBLISHED_REQUEST },
      {
        type: actions.EDIT_PUBLISHED_SUCCESS,
        draft_id,
        draft: {
          basic_info: {
            analysis_title: "sa",
            glance_id: "aS"
          }
        }
      },
      { type: actions.UPDATE_DRAFT_SUCCESS, draft_id, draft }
    ];

    axios.post = jest.fn(url => {
      return Promise.resolve({
        data: {
          metadata: {
            basic_info: {
              analysis_title: "sa",
              glance_id: "aS"
            }
          }
        }
      });
    });

    axios.put = jest.fn(url => {
      return Promise.resolve({
        data: draft
      });
    });

    const store = mockStore({});
    await store
      .dispatch(actions.postAndPutPublished(data, schema, draft_id))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it("Async Discard Draft", async () => {
    document.body.innerHTML = "<div id='ct-container'>" + "</div>";

    const draft_id = "84c9818192bb4b4aaf366846f83d0dad";

    const draft = {
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

    const expectedActions = [
      { type: actions.DISCARD_DRAFT_REQUEST },
      { type: actions.DISCARD_DRAFT_SUCCESS, draft_id, draft }
    ];

    axios.post = jest.fn(url => {
      return Promise.resolve({
        data: draft
      });
    });

    const store = mockStore({});
    await store.dispatch(actions.discardDraft(draft_id)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("Async Put and Update Draft", async () => {
    const data = {
      general_title: "aaaa"
    };
    const draft_id = "5420540547694043a3f3ebe44f6778ff";

    const draft = {
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

    const expectedActions = [
      { type: actions.UPDATE_DRAFT_REQUEST },
      { type: actions.UPDATE_DRAFT_SUCCESS, draft_id, draft }
    ];

    const store = mockStore({
      draftItem: Map({
        links: {
          self:
            "http://localhost:3000/api/deposits/2e0adc2de08441d98aa5a721695aaf6a"
        }
      })
    });

    axios.put = jest.fn(url => {
      return Promise.resolve({
        data: draft
      });
    });

    await store.dispatch(actions.putUpdateDraft(data, draft_id)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("Async Post Publish Draft", async () => {
    const links =
      "http://localhost:3000/api/deposits/84c9818192bb4b4aaf366846f83d0dad/actions/publish";
    const draft = {
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
    const published_id = "CAP.ALICE.G1I0.Y0L8";

    const expectedActions = [
      { type: actions.PUBLISH_DRAFT_REQUEST },
      { type: actions.PUBLISH_DRAFT_SUCCESS, published_id, draft }
    ];

    axios.post = jest.fn(url => {
      return Promise.resolve({
        data: draft
      });
    });

    const store = mockStore({
      draftItem: Map({
        links: links
      })
    });
    await store.dispatch(actions.postPublishDraft()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("Async Delete Draft", async () => {
    const store = mockStore({
      draftItem: Map({
        links:
          "http://localhost:3000/api/deposits/5420540547694043a3f3ebe44f6778ff"
      })
    });

    axios.delete = jest.fn(url => {
      return Promise.resolve({});
    });

    const expectedActions = [
      { type: actions.DELETE_DRAFT_REQUEST },
      { type: actions.DELETE_DRAFT_SUCCESS },
      {
        payload: { args: ["/"], method: "push" },
        type: "@@router/CALL_HISTORY_METHOD"
      }
    ];

    await store.dispatch(actions.deleteDraft()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("Async GetDraftByIdAndInitForm", async () => {
    const draft_id = "d858b8711a774656b917da0088aba123";
    const draft = {
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

    axios.get = jest.fn(url => {
      return Promise.resolve({
        data: draft
      });
    });

    const expectedActions = [
      { type: actions.DRAFTS_ITEM_REQUEST },
      { type: actions.DRAFTS_ITEM_SUCCESS, draft_id, draft }
    ];

    const store = mockStore({});

    await store.dispatch(actions.getDraftByIdAndInitForm(draft_id)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
