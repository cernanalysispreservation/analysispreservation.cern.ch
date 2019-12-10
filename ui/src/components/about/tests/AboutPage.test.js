import React from "react";
import { configure, shallow, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AboutPage from "../AboutPage";
import { MemoryRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../store/configureStore";

configure({ adapter: new Adapter() });

let wrapper;
beforeEach(() => {
  wrapper = mount(
    <Provider store={store}>
      <Router>
        <AboutPage />
      </Router>
    </Provider>
  );
});

describe("Checking the About page", () => {
  it("Snapshot test", () => {
    const shallowWrapper = shallow(<AboutPage />);
    expect(shallowWrapper).toMatchSnapshot();
  });

  it("Count the <Anchor/> ", () => {
    expect(wrapper.find(".grommetux-anchor")).toHaveLength(4);
  });

  it("Find the footer", () => {
    expect(wrapper.find("footer")).toHaveLength(1);
  });
});
