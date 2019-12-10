import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { List, Map } from "immutable";
import configureStore from "redux-mock-store";
import { configure, shallow, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import thunk from "redux-thunk";

import Dashboard from "../Dashboard";
import { Provider } from "react-redux";
import DashboardList from "../DashboardList";
import DashboardQuickSearch from "../DashboardQuickSearch";
import DashboardMeter from "../components/DashboardMeter";

const mockStore = configureStore([thunk]);

configure({ adapter: new Adapter() });

const items = {
  drafts: {
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
        }
      ]
    }
  },
  published: {
    all: {
      more: "/search?q=",
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
        }
      ]
    },
    mine: {
      more: "/search?q=&by_me=True",
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
        }
      ]
    }
  },
  workflows: {
    all: { list: [], more: "#" }
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

beforeEach(() => {
  wrapper = mount(
    <Provider store={store}>
      <Router>
        <Dashboard />
      </Router>
    </Provider>
  );
});

afterEach(() => {
  wrapper.unmount();
});

describe("Dashboard Test Suite", () => {
  it("Dashboard Snapshot", () => {
    const shallowWrapper = shallow(
      <Provider store={store}>
        <Router>
          <Dashboard loading={false} lists={items} />
        </Router>
      </Provider>
    );
    expect(shallowWrapper).toMatchSnapshot();
  });

  it("Display three Lists, published, drafts, workflows", () => {
    expect(wrapper.find(DashboardList)).toHaveLength(3);
  });

  it("Display the QuickSearch component", () => {
    expect(wrapper.find(DashboardQuickSearch)).toHaveLength(1);
  });

  it("Display the DashboardMeter component", () => {
    expect(wrapper.find(DashboardMeter)).toHaveLength(1);
  });
});
