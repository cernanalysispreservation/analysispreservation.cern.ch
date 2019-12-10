import React from "react";
import { configure, shallow, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Footer from "../Footer";
import AboutPage from "../../about/AboutPage";
import StatusPage from "../../status/StatusPage";
import { MemoryRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../store/configureStore";

configure({ adapter: new Adapter() });

let wrapper;
beforeEach(() => {
  wrapper = mount(
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/about" component={AboutPage} />
          <Route path="/status" component={StatusPage} />
          <Footer />
        </Switch>
      </Router>
    </Provider>
  );
});

afterEach(() => {
  wrapper.unmount();
});

describe("Find all the anchors in the Footer", () => {
  it("Footer Snapshot", () => {
    const shallowWrapper = shallow(<Footer />);
    expect(shallowWrapper).toMatchSnapshot();
  });

  it("Find three Anchors of Footer", () => {
    expect(wrapper.find(Footer).find(".grommetux-anchor")).toHaveLength(3);
  });

  it("Navigate to Status Page", () => {
    // Status page is not rendered
    expect(wrapper.find(StatusPage)).toHaveLength(0);

    // Click the anchor
    const aLink = wrapper.find(Footer).find('[href="/status"]');
    aLink.simulate("click");

    // Status Page is now rendered
    expect(wrapper.find(StatusPage)).toHaveLength(1);
  });

  it("Navigate to About Page", () => {
    // About Page is not rendered
    expect(wrapper.find(AboutPage)).toHaveLength(0);

    // Click the anchor
    const aLink = wrapper.find(Footer).find('[href="/about"]');
    aLink.simulate("click");

    // About Page is now rendered
    expect(wrapper.find(AboutPage)).toHaveLength(1);
  });
});
