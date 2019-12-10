import React from "react";
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import DropDown from "../DropDown";
import AddIcon from "grommet/components/icons/base/FormAdd";
import MinusIcon from "grommet/components/icons/base/FormSubtract";

configure({ adapter: new Adapter() });

let wrapper;
const items = [{ service: "github", status: 200 }];
beforeEach(() => {
  wrapper = mount(<DropDown items={items} />);
});
afterEach(() => {
  wrapper.unmount();
});

describe("DropDown Suite", () => {
  it("Take a snapshot", () => {
    const shallowDropDown = shallow(<DropDown />);
    expect(shallowDropDown).toMatchSnapshot();
  });

  it("Minimize the DropDown", () => {
    expect(wrapper.find(MinusIcon)).toHaveLength(1);
    wrapper.setState({ open: false });
    expect(wrapper.find(MinusIcon)).toHaveLength(0);
  });

  it("Expand the DropDown", () => {
    expect(wrapper.find(AddIcon)).toHaveLength(0);
    wrapper.setState({ open: false });
    expect(wrapper.find(AddIcon)).toHaveLength(1);
  });
});
