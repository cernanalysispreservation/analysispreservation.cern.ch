import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../auth";
import axios from "axios";
import "jest-localstorage-mock";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Actions => Auth", () => {
  it("Sync Action Creator (Login Request)", () => {
    const expectedAction = {
      type: actions.LOGIN_REQUEST
    };

    expect(actions.loginRequest()).toEqual(expectedAction);
  });

  it("Sync Action Creator (Login Success)", () => {
    const user = {
      next: "/",
      user: "info@inveniosoftware.org"
    };
    const expectedAction = {
      type: actions.LOGIN_SUCCESS,
      user
    };

    expect(actions.loginSuccess(user)).toEqual(expectedAction);
  });

  it("Async Logout Function", async () => {
    const expectedActions = [
      { type: actions.LOGOUT_REQUEST },
      { type: actions.LOGOUT_SUCCESS }
    ];

    // const url = "/api/logout";
    axios.get = jest.fn(url => {
      return Promise.resolve();
    });

    const store = mockStore({});
    await store.dispatch(actions.logout()).then(() => {
      // match the action calls
      expect(store.getActions()).toEqual(expectedActions);
      // check that localstorage was called once
      expect(localStorage.clear).toHaveBeenCalledTimes(1);
    });
  });

  it("Async Init Current User", async () => {
    // login Success User
    const user = {
      userId: 1,
      token: 1,
      profile: {
        id: 1,
        email: "info@inveniosoftware.org",
        deposit_groups: [
          {
            deposit_group: "alice-analysis",
            name: "ALICE ANALYSIS",
            schema_path: "deposits/records/alice-analysis-v0.0.1.json"
          },
          {
            deposit_group: "atlas-analysis",
            name: "ATLAS ANALYSIS",
            schema_path: "deposits/records/atlas-analysis-v0.0.1.json"
          },
          {
            deposit_group: "lhcb-analysis",
            name: "LHCB ANALYSIS",
            schema_path: "deposits/records/lhcb-analysis-v0.0.1.json"
          },
          {
            deposit_group: "cms-analysis",
            name: "CMS ANALYSIS",
            schema_path: "deposits/records/cms-analysis-v0.0.1.json"
          },
          {
            deposit_group: "cms-questionnaire",
            name: "Statistics Questionnaire",
            schema_path: "deposits/records/cms-questionnaire-v0.0.1.json"
          }
        ]
      },
      depositGroups: [
        {
          deposit_group: "alice-analysis",
          name: "ALICE ANALYSIS",
          schema_path: "deposits/records/alice-analysis-v0.0.1.json"
        },
        {
          deposit_group: "atlas-analysis",
          name: "ATLAS ANALYSIS",
          schema_path: "deposits/records/atlas-analysis-v0.0.1.json"
        },
        {
          deposit_group: "lhcb-analysis",
          name: "LHCB ANALYSIS",
          schema_path: "deposits/records/lhcb-analysis-v0.0.1.json"
        },
        {
          deposit_group: "cms-analysis",
          name: "CMS ANALYSIS",
          schema_path: "deposits/records/cms-analysis-v0.0.1.json"
        },
        {
          deposit_group: "cms-questionnaire",
          name: "Statistics Questionnaire",
          schema_path: "deposits/records/cms-questionnaire-v0.0.1.json"
        }
      ],
      permissions: true
    };
    // expected Actions
    const expectedActions = [
      { type: actions.INIT_CURRENT_USER_REQUEST },
      { type: actions.LOGIN_SUCCESS, user },
      { type: actions.INIT_CURRENT_USER_SUCCESS }
    ];

    axios.get = jest.fn(url => {
      return Promise.resolve({
        data: {
          id: 1,
          email: "info@inveniosoftware.org",
          deposit_groups: [
            {
              deposit_group: "alice-analysis",
              name: "ALICE ANALYSIS",
              schema_path: "deposits/records/alice-analysis-v0.0.1.json"
            },
            {
              deposit_group: "atlas-analysis",
              name: "ATLAS ANALYSIS",
              schema_path: "deposits/records/atlas-analysis-v0.0.1.json"
            },
            {
              deposit_group: "lhcb-analysis",
              name: "LHCB ANALYSIS",
              schema_path: "deposits/records/lhcb-analysis-v0.0.1.json"
            },
            {
              deposit_group: "cms-analysis",
              name: "CMS ANALYSIS",
              schema_path: "deposits/records/cms-analysis-v0.0.1.json"
            },
            {
              deposit_group: "cms-questionnaire",
              name: "Statistics Questionnaire",
              schema_path: "deposits/records/cms-questionnaire-v0.0.1.json"
            }
          ]
        }
      });
    });

    const store = mockStore({});
    await store.dispatch(actions.initCurrentUser()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
      // set the token in the localStorage
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  it("Async Create Token", async () => {
    const data = {
      name: "aaa",
      scopes: ["deposit:write"]
    };
    const token = {
      access_token:
        "IuMq66VXFgCjhGf4X1UgyIm8LGSp4bOHs1bPUjOHEK7xeEmS05F6u74hWkIo",
      name: "aaa",
      scopes: ["deposit:write"]
    };
    axios.post = jest.fn(url => {
      return Promise.resolve({
        data: token
      });
    });

    const expectedActions = [{ type: actions.CREATE_TOKEN_SUCCESS, token }];
    const store = mockStore({});
    await store.dispatch(actions.createToken(data)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("Async Revoke Token", async () => {
    const token = 12;
    const token_id = 13;

    axios.get = jest.fn(url => {
      return Promise.resolve({});
    });
    const expectedActions = [{ type: actions.REVOKE_TOKEN_SUCCESS, token }];
    const store = mockStore({});

    await store.dispatch(actions.revokeToken(token_id, token)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it("Async Login Local User", async () => {
    const user = {
      userId: 1,
      token: 1,
      profile: {
        id: 1,
        email: "info@inveniosoftware.org",
        deposit_groups: [
          {
            deposit_group: "alice-analysis",
            name: "ALICE ANALYSIS",
            schema_path: "deposits/records/alice-analysis-v0.0.1.json"
          },
          {
            deposit_group: "atlas-analysis",
            name: "ATLAS ANALYSIS",
            schema_path: "deposits/records/atlas-analysis-v0.0.1.json"
          },
          {
            deposit_group: "lhcb-analysis",
            name: "LHCB ANALYSIS",
            schema_path: "deposits/records/lhcb-analysis-v0.0.1.json"
          },
          {
            deposit_group: "cms-analysis",
            name: "CMS ANALYSIS",
            schema_path: "deposits/records/cms-analysis-v0.0.1.json"
          },
          {
            deposit_group: "cms-questionnaire",
            name: "Statistics Questionnaire",
            schema_path: "deposits/records/cms-questionnaire-v0.0.1.json"
          }
        ]
      },
      depositGroups: [
        {
          deposit_group: "alice-analysis",
          name: "ALICE ANALYSIS",
          schema_path: "deposits/records/alice-analysis-v0.0.1.json"
        },
        {
          deposit_group: "atlas-analysis",
          name: "ATLAS ANALYSIS",
          schema_path: "deposits/records/atlas-analysis-v0.0.1.json"
        },
        {
          deposit_group: "lhcb-analysis",
          name: "LHCB ANALYSIS",
          schema_path: "deposits/records/lhcb-analysis-v0.0.1.json"
        },
        {
          deposit_group: "cms-analysis",
          name: "CMS ANALYSIS",
          schema_path: "deposits/records/cms-analysis-v0.0.1.json"
        },
        {
          deposit_group: "cms-questionnaire",
          name: "Statistics Questionnaire",
          schema_path: "deposits/records/cms-questionnaire-v0.0.1.json"
        }
      ],
      permissions: true
    };

    const data = {
      password: "infoinfo",
      username: "info@inveniosoftware.org",

      rememberMe: undefined
    };
    const expectedActions = [
      { type: actions.LOGIN_REQUEST },
      { type: actions.INIT_CURRENT_USER_REQUEST },
      { type: actions.LOGIN_SUCCESS, user },
      { type: actions.INIT_CURRENT_USER_SUCCESS }
    ];

    axios.post = jest.fn(url => {
      return Promise.resolve({
        data: {
          next: undefined
        }
      });
    });

    axios.get = jest.fn(url => {
      return Promise.resolve({
        data: {
          id: 1,
          email: "info@inveniosoftware.org",
          deposit_groups: [
            {
              deposit_group: "alice-analysis",
              name: "ALICE ANALYSIS",
              schema_path: "deposits/records/alice-analysis-v0.0.1.json"
            },
            {
              deposit_group: "atlas-analysis",
              name: "ATLAS ANALYSIS",
              schema_path: "deposits/records/atlas-analysis-v0.0.1.json"
            },
            {
              deposit_group: "lhcb-analysis",
              name: "LHCB ANALYSIS",
              schema_path: "deposits/records/lhcb-analysis-v0.0.1.json"
            },
            {
              deposit_group: "cms-analysis",
              name: "CMS ANALYSIS",
              schema_path: "deposits/records/cms-analysis-v0.0.1.json"
            },
            {
              deposit_group: "cms-questionnaire",
              name: "Statistics Questionnaire",
              schema_path: "deposits/records/cms-questionnaire-v0.0.1.json"
            }
          ]
        }
      });
    });

    const store = mockStore({});
    await store.dispatch(actions.loginLocalUser(data)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
