import * as actions from "../../actions/draftItem";
import draftReducer from "../draftItem";
import { Map, fromJS, Set } from "immutable";
import { describe, expect, test } from "vitest";

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
      internal_discussions: "blah blah",
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"],
    },
  },
  revision: null,
  schema: null,
  status: null,
  type: null,
  updated: null,
};

// different states
const initialState = Map({
  errors: [],
  extraErrors: {},
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
  updated: null,
  formErrors: Set([]),
  fileVersions: fromJS([]),
});
const createDraftError = Map({
  errors: [],
  schemaErrors: [],
  extraErrors: {},
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
  updated: null,
  formErrors: Set([]),
  fileVersions: fromJS([]),
});
const createDraftSuccess = Map({
  errors: [],
  schemaErrors: [],
  extraErrors: {},
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
  metadata: {
    general_title: "This is the new title",
    additional_resources: {
      internal_discussions: "blah blah",
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"],
    },
  },
  formData: {
    general_title: "This is the new title",
    additional_resources: {
      internal_discussions: "blah blah",
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"],
    },
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
  revision: null,
  schema: null,
  schemas: null,
  status: null,
  type: null,
  updated: null,
  formErrors: Set([]),
  fileVersions: fromJS([]),
});
const loadingState = Map({
  errors: [],
  extraErrors: {},
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
  loading: true,
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
  updated: null,
  formErrors: Set([]),
  fileVersions: fromJS([]),
});
const generalTitleStateBefore = Map({
  errors: [],
  extraErrors: {},
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
      internal_discussions: "blah blah",
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"],
    },
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
      internal_discussions: "blah blah",
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"],
    },
  },
  revision: null,
  schema: null,
  schemas: null,
  status: null,
  type: null,
  updated: null,
  formErrors: Set([]),
  fileVersions: fromJS([]),
});
const generalTitleStateAfter = Map({
  errors: [],
  schemaErrors: [],
  extraErrors: {},
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
      internal_discussions: "blah blah",
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"],
    },
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
      internal_discussions: "blah blah",
    },
    basic_info: {
      abstract: "This is the abstract",
      conclusion: "This is the conclusion",
      ana_notes: ["AN-2121/212"],
    },
  },
  revision: null,
  schema: null,
  schemas: null,
  status: null,
  type: null,
  updated: null,
  generalTitleLoading: false,
  formErrors: Set([]),
  fileVersions: fromJS([]),
});

describe("DraftItem Reducers Test", () => {
  test("General Title Request", () => {
    const action = {
      type: actions.GENERAL_TITLE_REQUEST,
    };
    const state = initialState.set("generalTitleLoading", true);
    expect(draftReducer(initialState, action)).toEqual(state);
  });

  test("General Title Success", () => {
    const action = {
      type: actions.GENERAL_TITLE_SUCCESS,
      draft,
    };
    expect(draftReducer(generalTitleStateBefore, action)).toEqual(
      generalTitleStateAfter
    );
  });

  test("General Title Error", () => {
    const action = {
      type: actions.GENERAL_TITLE_ERROR,
    };
    const state = initialState.set("generalTitleLoading", false);
    expect(draftReducer(initialState, action)).toEqual(state);
  });

  test("Create Draft Request", () => {
    const action = {
      type: actions.CREATE_DRAFT_REQUEST,
    };

    expect(draftReducer(initialState, action)).toEqual(loadingState);
  });

  test("Create Draft Success", () => {
    const action = {
      type: actions.CREATE_DRAFT_SUCCESS,
      draft,
    };

    expect(draftReducer(initialState, action)).toEqual(createDraftSuccess);
  });

  test("Create Draft Error", () => {
    const action = {
      type: actions.CREATE_DRAFT_ERROR,
      error: "this is an error message for create draft error",
    };

    expect(draftReducer(initialState, action)).toEqual(createDraftError);
  });

  test("Publish Draft Request", () => {
    const action = {
      type: actions.PUBLISH_DRAFT_REQUEST,
    };

    expect(draftReducer(initialState, action)).toEqual(loadingState);
  });

  test("Publish Draft Success", () => {
    const action = {
      type: actions.PUBLISH_DRAFT_SUCCESS,
      draft,
    };

    // The only difference with the CREATE_DRAFT_SUCCESS is that the create add the metadata to the initialState
    // while the publish success add the metadata to the existing state
    expect(draftReducer(initialState, action)).toEqual(createDraftSuccess);
  });

  // the compared state remains the initial state
  // since there is no reason to update the error in the state
  // the error will be displayed in the toastetr
  test("Publish Draft Error", () => {
    const action = {
      type: actions.PUBLISH_DRAFT_ERROR,
      errors: {},
    };

    expect(draftReducer(initialState, action)).toEqual(initialState);
  });
});
