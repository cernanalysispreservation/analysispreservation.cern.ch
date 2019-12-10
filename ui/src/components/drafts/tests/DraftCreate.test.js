import React from "react";
import { configure, shallow, render, mount } from "enzyme";
import { Map, List, fromJS } from "immutable";
import Adapter from "enzyme-adapter-react-16";

import DraftCreate from "../DraftCreate";
import { MemoryRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
const mockStore = configureStore([]);

configure({ adapter: new Adapter() });

let wrapper;
let store;

store = mockStore({
  auth: Map({
    isLoggedIn: false,
    currentUser: Map({}),
    // token: localStorage.getItem("token"),
    error: null,
    loading: false,
    loadingInit: true,
    tokens: List(),
    integrations: Map({})
  }),
  draftItem: Map({
    errors: [],
    schemaErrors: [],
    actionsLayer: false,
    showPreviewer: false,
    filePreviewEditLayer: true,
    filePreviewEdit: {},

    workflows: fromJS([]),
    workflows_items: fromJS({}),
    bucket: Map({}),
    formData: null,
    // From backend: deposit resource
    access: null,
    can_admin: false,
    can_update: false,
    created: null,
    loading: false,
    created_by: null,
    experiment: null,
    files: Map({}),
    id: null,
    links: null,
    metadata: {},
    revision: null,
    schema: null,
    schemas: null,
    status: null,
    type: null,
    updated: null
  })
});

describe("Main Header Component", () => {
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <DraftCreate />
      </Provider>
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("Should Match", () => {
    const shallowHeader = shallow(
      <Provider store={store}>
        <DraftCreate />
      </Provider>
    );

    expect(shallowHeader).toMatchSnapshot();
  });
});
