import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";

import Modal from "../Modal";

configure({ adapter: new Adapter() });

// set the wrapper for the modal
let wrapper;
let content = <h1>MyTitle</h1>;
beforeEach(() => {
  wrapper = mount(
    <Modal title="This is my title" tag="h5" onClose={() => console.log()}>
      {content}
    </Modal>
  );
});

// clear and unmount after the end of each test
afterEach(() => {
  wrapper.unmount();
});

describe("Modal Suite", () => {
  it("Snapshot image", () => {
    const shallowWrapper = shallow(<Modal />);
    expect(shallowWrapper).toMatchSnapshot();
  });

  it("Modal Children render", () => {
    // children content
    expect(wrapper.find("h1")).toHaveLength(1);
    // header tag
    expect(wrapper.find("h5")).toHaveLength(1);
    // overrides defaults header tag value
    expect(wrapper.find("h3")).toHaveLength(0);
  });

  it("Modal close icon click functionality", () => {
    const spy = jest.spyOn(console, "log");
    const btn = wrapper.find("div.func-close");
    expect(spy).toHaveBeenCalledTimes(0);
    btn.simulate("click");
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
