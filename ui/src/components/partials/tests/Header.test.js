import React from "react";
import { configure, shallow, render, mount } from "enzyme";
import { Map, List, fromJS } from "immutable";
import Adapter from "enzyme-adapter-react-16";
import Header from "../Header";
import Layer from "grommet/components/Layer";
import SearchPage from "../../search/SearchPage";
import DraftCreate from "../../drafts/DraftCreate";
import { MemoryRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

configure({ adapter: new Adapter() });

let wrapper;
let store;

store = mockStore({
  auth: Map({
    isLoggedIn: true,
    currentUser: Map({
      userId: 1,
      token: 1,
      permissions: true,
      depositGroups: List()
    }),
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
    id: "1",
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
        <Router>
          <Switch>
            <Header />
            <Route exact path="/search" component={SearchPage} />
          </Switch>
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("Open How to Search page", () => {
    const shallowHeader = shallow(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>
    );

    expect(shallowHeader).toMatchSnapshot();
  });

  it("State is updated", () => {
    expect(wrapper.state("showCreate")).not.toBeTruthy();
    wrapper.setState({ showCreate: true });
    expect(wrapper.state("showCreate")).toBeTruthy();
    expect(wrapper.state("show")).not.toBeTruthy();
    wrapper.setState({ show: true });
    expect(wrapper.state("show")).toBeTruthy();
  });

  it("Open the help layer", () => {
    // the layer in the beginning is hidden, not rendered
    expect(wrapper.find(Header).find(Layer)).toHaveLength(0);

    // const aLink = wrapper.find(".grommetux-anchor--animate-icon");
    const aLink = wrapper.find('[aria-label="circle-question"]');
    aLink.simulate("click");

    // display the layer with information regarding search
    expect(wrapper.find(Header).find(Layer)).toHaveLength(1);
  });

  it("Open the create layer", () => {
    // CreateDraft layer is hidden
    expect(wrapper.find(Header).find(DraftCreate)).toHaveLength(0);

    // create button is clicked
    const aLink = wrapper.find(".grommetux-box--clickable");
    aLink.simulate("click");

    // create draft layer is displayed
    expect(wrapper.find(Header).find(DraftCreate)).toHaveLength(1);
  });
});
