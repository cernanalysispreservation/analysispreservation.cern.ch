import React from "react";
import { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { BrowserRouter as Router } from "react-router-dom";
import DashboardListItem from "../DashboardListItem";
import { Provider } from "react-redux";
import { List, Map } from "immutable";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

configure({ adapter: new Adapter() });

const properties = {
  all: {
    more: "/drafts?q=",
    list: [
      {
        access: {
          "deposit-admin": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-read": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-update": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          }
        },
        can_admin: true,
        can_update: true,
        created: "2019-12-03T11:41:18.490459+00:00",
        created_by: "info@inveniosoftware.org",
        files: [],
        "import {  } from 'module'": "9f1ed8b130a84fbab36d2a515dc67cff",
        is_owner: true,
        links: {},
        metadata: {
          general_title: "Cast"
        },
        revision: 2,
        schema: {
          name: "lhcb-analysis",
          version: "0.0.1"
        },
        status: "draft",
        type: "deposit",
        updated: "2019-12-03T11:41:20.715169+00:00"
      },
      {
        access: {
          "deposit-admin": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-read": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-update": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          }
        },
        can_admin: true,
        can_update: true,
        created: "2019-12-03T11:41:18.490459+00:00",
        created_by: "info@inveniosoftware.org",
        files: [],
        "import {  } from 'module'": "9f1ed8b130a84fbab36d2a515dc67cff",
        is_owner: true,
        links: {},
        metadata: {
          general_title: "Cast"
        },
        revision: 2,
        schema: {
          name: "lhcb-analysis",
          version: "0.0.1"
        },
        status: "draft",
        type: "deposit",
        updated: "2019-12-03T11:41:20.715169+00:00"
      },
      {
        access: {
          "deposit-admin": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-read": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-update": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          }
        },
        can_admin: true,
        can_update: true,
        created: "2019-12-03T11:41:18.490459+00:00",
        created_by: "info@inveniosoftware.org",
        files: [],
        "import {  } from 'module'": "9f1ed8b130a84fbab36d2a515dc67cff",
        is_owner: true,
        links: {},
        metadata: {
          general_title: "Cast"
        },
        revision: 2,
        schema: {
          name: "lhcb-analysis",
          version: "0.0.1"
        },
        status: "draft",
        type: "deposit",
        updated: "2019-12-03T11:41:20.715169+00:00"
      },
      {
        access: {
          "deposit-admin": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-read": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-update": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          }
        },
        can_admin: true,
        can_update: true,
        created: "2019-12-03T11:41:18.490459+00:00",
        created_by: "info@inveniosoftware.org",
        files: [],
        "import {  } from 'module'": "9f1ed8b130a84fbab36d2a515dc67cff",
        is_owner: true,
        links: {},
        metadata: {
          general_title: "Cast"
        },
        revision: 2,
        schema: {
          name: "lhcb-analysis",
          version: "0.0.1"
        },
        status: "draft",
        type: "deposit",
        updated: "2019-12-03T11:41:20.715169+00:00"
      },
      {
        access: {
          "deposit-admin": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-read": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-update": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          }
        },
        can_admin: true,
        can_update: true,
        created: "2019-12-03T11:41:18.490459+00:00",
        created_by: "info@inveniosoftware.org",
        files: [],
        "import {  } from 'module'": "9f1ed8b130a84fbab36d2a515dc67cff",
        is_owner: true,
        links: {},
        metadata: {
          general_title: "Cast"
        },
        revision: 2,
        schema: {
          name: "lhcb-analysis",
          version: "0.0.1"
        },
        status: "draft",
        type: "deposit",
        updated: "2019-12-03T11:41:20.715169+00:00"
      }
    ]
  },
  mine: {
    more: "/drafts?q=&by_me=True",
    list: [
      {
        access: {
          "deposit-admin": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-read": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-update": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          }
        },
        can_admin: true,
        can_update: true,
        created: "2019-12-03T11:41:18.490459+00:00",
        created_by: "info@inveniosoftware.org",
        files: [],
        "import {  } from 'module'": "9f1ed8b130a84fbab36d2a515dc67cff",
        is_owner: true,
        links: {},
        metadata: {
          general_title: "Cast"
        },
        revision: 2,
        schema: {
          name: "lhcb-analysis",
          version: "0.0.1"
        },
        status: "draft",
        type: "deposit",
        updated: "2019-12-03T11:41:20.715169+00:00"
      },
      {
        access: {
          "deposit-admin": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-read": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-update": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          }
        },
        can_admin: true,
        can_update: true,
        created: "2019-12-03T11:41:18.490459+00:00",
        created_by: "info@inveniosoftware.org",
        files: [],
        "import {  } from 'module'": "9f1ed8b130a84fbab36d2a515dc67cff",
        is_owner: true,
        links: {},
        metadata: {
          general_title: "Cast"
        },
        revision: 2,
        schema: {
          name: "lhcb-analysis",
          version: "0.0.1"
        },
        status: "draft",
        type: "deposit",
        updated: "2019-12-03T11:41:20.715169+00:00"
      },
      {
        access: {
          "deposit-admin": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-read": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-update": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          }
        },
        can_admin: true,
        can_update: true,
        created: "2019-12-03T11:41:18.490459+00:00",
        created_by: "info@inveniosoftware.org",
        files: [],
        "import {  } from 'module'": "9f1ed8b130a84fbab36d2a515dc67cff",
        is_owner: true,
        links: {},
        metadata: {
          general_title: "Cast"
        },
        revision: 2,
        schema: {
          name: "lhcb-analysis",
          version: "0.0.1"
        },
        status: "draft",
        type: "deposit",
        updated: "2019-12-03T11:41:20.715169+00:00"
      },
      {
        access: {
          "deposit-admin": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-read": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-update": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          }
        },
        can_admin: true,
        can_update: true,
        created: "2019-12-03T11:41:18.490459+00:00",
        created_by: "info@inveniosoftware.org",
        files: [],
        "import {  } from 'module'": "9f1ed8b130a84fbab36d2a515dc67cff",
        is_owner: true,
        links: {},
        metadata: {
          general_title: "Cast"
        },
        revision: 2,
        schema: {
          name: "lhcb-analysis",
          version: "0.0.1"
        },
        status: "draft",
        type: "deposit",
        updated: "2019-12-03T11:41:20.715169+00:00"
      },
      {
        access: {
          "deposit-admin": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-read": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          },
          "deposit-update": {
            roles: [],
            users: ["info@inveniosoftware.org"]
          }
        },
        can_admin: true,
        can_update: true,
        created: "2019-12-03T11:41:18.490459+00:00",
        created_by: "info@inveniosoftware.org",
        files: [],
        "import {  } from 'module'": "9f1ed8b130a84fbab36d2a515dc67cff",
        is_owner: true,
        links: {},
        metadata: {
          general_title: "Cast"
        },
        revision: 2,
        schema: {
          name: "lhcb-analysis",
          version: "0.0.1"
        },
        status: "draft",
        type: "deposit",
        updated: "2019-12-03T11:41:20.715169+00:00"
      }
    ]
  }
};

let wrapper;
let store;

store = mockStore({
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
      user_count: 0
    }
  }),
  auth: Map({
    isLoggedIn: true,
    currentUser: Map({
      userId: 1,
      token: 1,
      permissions: true,
      depositGroups: List()
    })
  })
});
describe("DashboardList Test Suite", () => {
  beforeEach(() => {
    wrapper = shallow(
      <Provider store={store}>
        <Router>
          <DashboardListItem
            key={1}
            item={properties.all.list[0]}
            listType="draft"
          />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("Take a DashboardList Snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
