import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow, mount } from "enzyme";
import configureStore from "redux-mock-store";
import { Map, fromJS } from "immutable";

import DraftEditorHeader from "../DraftEditorHeader";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";

configure({ adapter: new Adapter() });
const mockStore = configureStore([]);

let store = mockStore({
  draftItem: Map({
    errors: [],
    schemaErrors: [],
    actionsLayer: false,
    actionsLayerType: null,
    showPreviewer: false,
    filePreviewEditLayer: true,
    filePreviewEdit: {},
    uploadFiles: Map({}),
    pathSelected: null,

    workflows: fromJS([]),
    workflows_items: fromJS({}),
    bucket: Map({}),
    formData: {},
    // From backend: deposit resource
    access: null,
    can_admin: false,
    can_update: true,
    created: null,
    loading: false,
    created_by: null,
    experiment: null,
    files: Map({}),
    id: "123",
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
// error free validate
const validate = jest.fn(() => {
  return {
    errors: []
  };
});
// validate to return errors
const validateError = jest.fn(() => {
  return {
    errors: ["one"]
  };
});
const submit = jest.fn(() => {
  return Promise.resolve({});
});

const formRef = {
  current: {
    validate: validate,
    submit: submit,
    props: { formData: {} }
  }
};
const formRefError = {
  current: {
    validate: validateError,
    submit: submit,
    props: { formData: {} }
  }
};

let wrapper;
document.body.innerHTML = "<div id='ct-container'>" + "</div>";
// Since we added the preview mode and the edit mode
// in order to validate the props and check the functionality of buttons
// we pass as mode the edit in order to be functional
beforeEach(() => {
  wrapper = mount(
    <Provider store={store}>
      <Router>
        <DraftEditorHeader formRef={formRef} mode="edit" />
      </Router>
    </Provider>
  );
});

afterEach(() => {
  wrapper.unmount();
});

describe("DraftEditorHeader Suite", () => {
  it("Take a Snapshot", () => {
    const shallowWrapper = shallow(<DraftEditorHeader />);
    expect(shallowWrapper).toMatchSnapshot();
  });

  it("Find the Save Button", () => {
    expect(wrapper.find("div.save-btn")).toHaveLength(1);
  });

  it("CheckIfEmpty will be called when the user saves the form", () => {
    const save = wrapper.find("div.save-btn");
    const spy = jest.spyOn(
      wrapper.find("DraftEditorHeader").instance(),
      "_checkIfEmpty"
    );

    expect(spy).toHaveBeenCalledTimes(0);
    save.simulate("click");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("CheckIfEmpty will not be called due to errors", () => {
    const wrap = mount(
      <Provider store={store}>
        <Router>
          <DraftEditorHeader formRef={formRefError} />
        </Router>
      </Provider>
    );
    const spy = jest.spyOn(
      wrap.find("DraftEditorHeader").instance(),
      "_checkIfEmpty"
    );
    const save = wrapper.find("div.save-btn");
    save.simulate("click");
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("Expect Empty Object", () => {
    const formData = {};
    const result = wrapper
      .find("DraftEditorHeader")
      .instance()
      ._checkIfEmpty(formData);
    expect(result).toBeTruthy();
  });

  it("Expect Empty Object", () => {
    const formData = {
      basic_info: {},
      additional_info: {},
      n_tuples: {
        name: "        ",
        year: undefined
      }
    };
    const result = wrapper
      .find("DraftEditorHeader")
      .instance()
      ._checkIfEmpty(formData);
    expect(result).toBeTruthy();
  });

  it("Expect Not Empty data", () => {
    const formData = {
      basic_info: {},
      additional_info: {},
      n_tuples: {
        name: "check for the title",
        year: 1991
      }
    };
    const result = wrapper
      .find("DraftEditorHeader")
      .instance()
      ._checkIfEmpty(formData);
    expect(result).toBeFalsy();
  });
});
