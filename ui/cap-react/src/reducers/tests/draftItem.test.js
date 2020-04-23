import * as actions from "../../actions/draftItem";
import draftReducer from "../draftItem";
import { Map, fromJS } from "immutable";

// action draft
const draft = {
  access: null,
  created: null,
  created_by: null,
  experiment: null,
  files: Map({}),
  id: null,
  links: null,
  metadata: {
    general_title: "This is the new title",
    additional_resources: {
      internal_discussions: "blah blah"
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"]
    }
  },
  revision: null,
  schema: null,
  status: null,
  type: null,
  updated: null
};

// different states
const initialState = Map({
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
});
const generalTitleStateBefore = Map({
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
  formData: {
    general_title: "This is the new title",
    additional_resources: {
      internal_discussions: "blah blah"
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"]
    }
  },
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
  metadata: {
    general_title: "This is an old Title",
    additional_resources: {
      internal_discussions: "blah blah"
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"]
    }
  },
  revision: null,
  schema: null,
  schemas: null,
  status: null,
  type: null,
  updated: null
});
const generalTitleStateAfter = Map({
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
  formData: {
    general_title: "This is the new title",
    additional_resources: {
      internal_discussions: "blah blah"
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"]
    }
  },
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
  metadata: {
    general_title: "This is the new title",
    additional_resources: {
      internal_discussions: "blah blah"
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"]
    }
  },
  revision: null,
  schema: null,
  schemas: null,
  status: null,
  type: null,
  updated: null,
  generalTitleLoading: false
});

describe("DraftItem Reducers Test", () => {
  it("General Title Request", () => {
    const action = {
      type: actions.GENERAL_TITLE_REQUEST
    };
    const state = initialState.set("generalTitleLoading", true);
    expect(draftReducer(initialState, action)).toEqual(state);
  });

  it("General Title Success", () => {
    const action = {
      type: actions.GENERAL_TITLE_SUCCESS,
      draft
    };
    expect(draftReducer(generalTitleStateBefore, action)).toEqual(
      generalTitleStateAfter
    );
  });

  it("General Title Error", () => {
    const action = {
      type: actions.GENERAL_TITLE_ERROR
    };
    const state = initialState.set("generalTitleLoading", false);
    expect(draftReducer(initialState, action)).toEqual(state);
  });
});
