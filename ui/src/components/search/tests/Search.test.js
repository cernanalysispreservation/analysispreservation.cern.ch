import React from "react";
import { configure, shallow, render, mount } from "enzyme";
import { Map, List, fromJS } from "immutable";
import Adapter from "enzyme-adapter-react-16";

import SearchPage from "../SearchPage";

import { MemoryRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

configure({ adapter: new Adapter() });

let wrapper;
let store;

store = mockStore({
  search: Map({
    query: "",
    aggs: Map({}),
    selectedAggs: Map({}),
    results: Map({
      hits: Map({}),
      links: Map({}),
      aggregations: Map({})
    }),
    error: Map({}),
    loading: false
  })
});
beforeEach(() => {
  wrapper = mount(
    <Provider store={store}>
      <Router>
        <SearchPage />
      </Router>
    </Provider>
  );
});

afterEach(() => {
  wrapper.unmount();
});
describe("Main Header Component", () => {
  it("Should Match", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
