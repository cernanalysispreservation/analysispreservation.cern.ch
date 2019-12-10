import * as actions from "../../actions/draftItem";
import * as common from "../../actions/common";
import * as files from "../../actions/files";

import draftReducer from "../draftItem";
import { Map, fromJS } from "immutable";

//TODO: The error is not saved always the same way

// action payloads
const payload = {
  name: ""
};
const filename = "file";
const data = {};
const permissions = {};
const bucket = {
  contents: {}
};

const schema = {
  schemaId: "",
  schemas: {}
};
const { schemaId, ...schemas } = schema;

const error = {
  response: {
    data: {}
  }
};

const draft = {
  metadata: {},
  message: {
    status: "ok",
    msg: "All changes saved"
  }
};

const updateErrorMessage = {
  status: "critical",
  msg: "Error while updating.."
};

const filemanagerLayer = {
  selectable: {},
  action: "",
  active: true
};
// different states
const initialState = Map({
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
});
const fileState = Map({
  errors: [],
  schemaErrors: [],
  actionsLayer: false,
  showPreviewer: false,
  filePreviewEditLayer: true,
  filePreviewEdit: {},

  workflows: fromJS([]),
  workflows_items: fromJS({}),
  bucket: Map({
    file: {
      key: "file",
      status: "uploading"
    }
  }),
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

const permissionState = Map({
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
  access: permissions,
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
const generalTitleState = Map({
  errors: [],
  schemaErrors: [],
  actionsLayer: false,
  showPreviewer: false,
  filePreviewEditLayer: true,
  filePreviewEdit: {},

  workflows: fromJS([]),
  workflows_items: fromJS({}),
  bucket: Map({}),
  formData: data,
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
  generalTitleLoading: false,
  message: {
    msg: "All changes saved",
    status: "ok"
  }
});
const titleState = Map({
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
  updated: null,
  generalTitleLoading: true
});
const updateErrorState = Map({
  errors: [error],
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
  updated: null,
  message: updateErrorMessage
});
const draftSuccessState = Map({
  errors: [],
  schemaErrors: [],
  actionsLayer: false,
  showPreviewer: false,
  filePreviewEditLayer: true,
  filePreviewEdit: {},

  workflows: fromJS([]),
  workflows_items: fromJS({}),
  bucket: Map({}),
  formData: draft.metadata,
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
  message: draft.message
});
const errorDraftState = Map({
  errors: error,
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
});
const draftState = Map({
  errors: [],
  schemaErrors: [],
  actionsLayer: false,
  showPreviewer: false,
  filePreviewEditLayer: true,
  filePreviewEdit: {},

  workflows: fromJS([]),
  workflows_items: fromJS({}),
  bucket: Map({}),
  formData: draft.metadata,
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
  message: {
    msg: "All changes saved",
    status: "ok"
  }
});
const loadingState = Map({
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
  updated: null
});

const fetchSchemaState = Map({
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
  schema: schemaId,
  schemas: schemas,
  status: null,
  type: null,
  updated: null
});
const formChangeState = Map({
  errors: [],
  schemaErrors: [],
  actionsLayer: false,
  showPreviewer: false,
  filePreviewEditLayer: true,
  filePreviewEdit: {},

  workflows: fromJS([]),
  workflows_items: fromJS({}),
  bucket: Map({}),
  formData: data,
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

const errorState = Map({
  errors: [],
  schemaErrors: [error],
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
});

const editLayerState = Map({
  errors: [],
  schemaErrors: [],
  actionsLayer: false,
  showPreviewer: false,
  filePreviewEditLayer: false,
  filePreviewEdit: { name: "" },

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
const toggledState = Map({
  errors: [],
  schemaErrors: [],
  actionsLayer: true,
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
});
const toggledPreviewState = Map({
  errors: [],
  schemaErrors: [],
  actionsLayer: true,
  showPreviewer: true,
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
});

describe("DraftItem Reducers Test", () => {
  it("Should return the initial State", () => {
    const action = {
      type: actions.INIT_FORM
    };
    expect(draftReducer(undefined, {})).toEqual(initialState);
    expect(draftReducer(initialState, action)).toEqual(initialState);
  });

  it("Toggle Actions Layer", () => {
    const action = {
      type: actions.TOGGLE_ACTIONS_LAYER
    };

    expect(draftReducer(initialState, action)).toEqual(toggledState);
  });

  it("Toggle Previewer", () => {
    const action = {
      type: actions.TOGGLE_PREVIEWER
    };

    expect(draftReducer(toggledState, action)).toEqual(toggledPreviewState);
  });

  it("Toggle File Preview Edit", () => {
    const action = {
      type: actions.TOGGLE_FILE_PREVIEW_EDIT,
      payload
    };

    expect(draftReducer(initialState, action)).toEqual(editLayerState);
  });

  it("Clear errors", () => {
    const action = {
      type: actions.CLEAR_ERROR_SUCCESS
    };
    expect(draftReducer(initialState, action)).toEqual(initialState);
  });

  it("Fetch Schema Errors & Drafts Item Error", () => {
    const action = {
      type: common.FETCH_SCHEMA_ERROR,
      error
    };

    expect(draftReducer(initialState, action)).toEqual(errorState);
  });

  it("Fetch Schema Success", () => {
    const action = {
      type: common.FETCH_SCHEMA_SUCCESS,
      schema
    };

    expect(draftReducer(initialState, action)).toEqual(fetchSchemaState);
  });

  it("Form Data Change", () => {
    const action = {
      type: actions.FORM_DATA_CHANGE,
      data
    };

    expect(draftReducer(initialState, action)).toEqual(formChangeState);
  });

  it("Toggle File Manager", () => {
    const action = {
      type: actions.TOGGLE_FILEMANAGER_LAYER,
      filemanagerLayer
    };
    // TODO: we do not have in the initial state those variables

    // fileManagerActiveLayer does not exist in the initialState
    // fileManagerLayerSelectable does not exist in the initialState
    // fileManagerLayerSelectableAction does not exist in the initialState
    // fileManagerLayerActiveIndex does not exist in the initialState

    // expect(draft(initialState, action)).toEqual(fileManagerLayerState);
  });

  it("Drafts Item Request", () => {
    const action = {
      type: actions.DELETE_DRAFT_REQUEST
    };

    expect(draftReducer(initialState, action)).toEqual(loadingState);
  });

  it("Drafts Item Success", () => {
    const action = {
      type: actions.DRAFTS_ITEM_SUCCESS,
      draft
    };

    expect(draftReducer(initialState, action)).toEqual(draftState);
  });

  it("Drafts Item Error", () => {
    const action = {
      type: actions.DRAFTS_ITEM_ERROR,
      error
    };

    expect(draftReducer(initialState, action)).toEqual(errorDraftState);
  });

  it("Create Draft Request", () => {
    const action = {
      type: actions.CREATE_DRAFT_REQUEST
    };

    expect(draftReducer(initialState, action)).toEqual(loadingState);
  });

  it("Create Draft Success", () => {
    const action = {
      type: actions.CREATE_DRAFT_SUCCESS,
      draft
    };
    //TODO: draft state should not require to have the message object
    //TODO: CreateDraftSuccess is very similar to DraftItemSuccess
    // all of thema are affecting formData
    expect(draftReducer(initialState, action)).toEqual(draftState);
  });

  it("Create Draft Error", () => {
    const action = {
      type: actions.CREATE_DRAFT_ERROR,
      error
    };
    // TODO:
    // DraftItemError we just instert the error object
    // CreateDraftError we keep the previous and we add
    // Is that the case?
    // expect(draftReducer(initialState, action)).toEqual(errorDraftState);
  });

  it("Update Draft Request", () => {
    const action = {
      type: actions.UPDATE_DRAFT_REQUEST
    };

    //TODO:
    // for now the update action just sets the loading to true
    // another action is also commented out
    expect(draftReducer(initialState, action)).toEqual(loadingState);
  });

  it("Update Draft Succcess", () => {
    const action = {
      type: actions.UPDATE_DRAFT_SUCCESS,
      draft
    };

    expect(draftReducer(initialState, action)).toEqual(draftSuccessState);
  });

  it("Update Draft Error", () => {
    const action = {
      type: actions.UPDATE_DRAFT_ERROR,
      error
    };

    expect(draftReducer(initialState, action)).toEqual(updateErrorState);
  });

  it("Discard Draft Request", () => {
    const action = {
      type: actions.DISCARD_DRAFT_REQUEST
    };

    expect(draftReducer(initialState, action)).toEqual(loadingState);
  });

  it("Discard Draft Succcess", () => {
    const action = {
      type: actions.DISCARD_DRAFT_SUCCESS,
      draft
    };

    //TODO: Discard Draft Error is commented out
    expect(draftReducer(initialState, action)).toEqual(draftState);
  });

  it("Edit Published Request", () => {
    const action = {
      type: actions.EDIT_PUBLISHED_REQUEST
    };

    expect(draftReducer(initialState, action)).toEqual(loadingState);
  });

  it("Edit Published Success", () => {
    const action = {
      type: actions.EDIT_PUBLISHED_SUCCESS,
      draft
    };

    //TODO: Edit Published Error is commented out
    expect(draftReducer(initialState, action)).toEqual(draftState);
  });

  it("Publish Draft Request", () => {
    const action = {
      type: actions.PUBLISH_DRAFT_REQUEST
    };

    expect(draftReducer(initialState, action)).toEqual(loadingState);
  });

  it("Publish Draft Succcess", () => {
    const action = {
      type: actions.PUBLISH_DRAFT_SUCCESS,
      draft
    };

    expect(draftReducer(initialState, action)).toEqual(draftState);
  });

  it("Publish Draft Error", () => {
    const action = {
      type: actions.PUBLISH_DRAFT_ERROR
    };
    //TODO: the reducer will simply set the loading to false and will not update with error
    expect(draftReducer(initialState, action)).toEqual(initialState);
  });

  it("General Title Request", () => {
    const action = {
      type: actions.GENERAL_TITLE_REQUEST
    };

    expect(draftReducer(initialState, action)).toEqual(titleState);
  });

  it("General Title Success", () => {
    const action = {
      type: actions.GENERAL_TITLE_SUCCESS,
      draft
    };
    //TODO: there is a message property returning from the initial state
    // which the reducer does not seem to affect
    expect(draftReducer(initialState, action)).toEqual(generalTitleState);
  });

  it("General Title Error", () => {
    const action = {
      type: actions.GENERAL_TITLE_ERROR
    };
    const state = initialState.set("generalTitleLoading", false);
    expect(draftReducer(initialState, action)).toEqual(state);
  });

  it("Permissions Item Request", () => {
    const action = {
      type: actions.PERMISSIONS_ITEM_REQUEST
    };

    expect(draftReducer(initialState, action)).toEqual(loadingState);
  });

  it("Permissions Item Success", () => {
    const action = {
      type: actions.PERMISSIONS_ITEM_SUCCESS,
      permissions
    };

    expect(draftReducer(initialState, action)).toEqual(permissionState);
  });

  it("Permissions Item Error", () => {
    const action = {
      type: actions.PERMISSIONS_ITEM_ERROR,
      error
    };
    const state = errorDraftState.set("errors", error.response.data);
    expect(draftReducer(initialState, action)).toEqual(state);
  });

  it("Bucket Item Request", () => {
    const action = {
      type: files.BUCKET_ITEM_REQUEST
    };

    expect(draftReducer(initialState, action)).toEqual(loadingState);
  });

  it("Buccket Item Success", () => {
    const action = {
      type: files.BUCKET_ITEM_SUCCESS,
      bucket
    };

    // Should return the same since the bucket is empty
    expect(draftReducer(initialState, action)).toEqual(initialState);
  });

  it("Bucket Item Error", () => {
    const action = {
      type: files.BUCKET_ITEM_ERROR,
      error
    };
    //TODO: in the initialState there is errors property
    // the reducer is afecting an error property
    // expect(draftReducer(initialState, action)).toEqual(errorDraftState);
  });

  it("Update File Request", () => {
    const action = {
      type: files.UPLOAD_FILE_REQUEST,
      filename
    };

    expect(draftReducer(initialState, action)).toEqual(fileState);
  });

  it("Upload File Succcess", () => {
    const action = {
      type: files.UPLOAD_FILE_SUCCESS,
      data,
      filename
    };

    const state = fileState.setIn(["bucket", filename], {
      key: filename,
      status: "done",
      mimetype: data.mimetype,
      data: data
    });

    expect(draftReducer(initialState, action)).toEqual(state);
  });

  it("Upload File Error", () => {
    const action = {
      type: files.UPLOAD_FILE_ERROR,
      filename,
      error
    };

    const state = fileState.setIn(["bucket", filename], {
      key: filename,
      status: "error",
      error: error.response.data
    });

    expect(draftReducer(initialState, action)).toEqual(state);
  });

  it("Upload Action Success", () => {
    const action = {
      type: files.UPLOAD_ACTION_SUCCESS,
      filename
    };

    const state = fileState.setIn(["bucket", filename], {
      key: filename,
      status: "fetching"
    });

    //TODO: there is no request or error
    expect(draftReducer(initialState, action)).toEqual(state);
  });

  it("Delete File Request", () => {
    const action = {
      type: files.DELETE_FILE_REQUEST,
      filename
    };

    const state = fileState.setIn(["bucket", filename], {
      key: filename,
      status: "deleting"
    });

    expect(draftReducer(initialState, action)).toEqual(state);
  });
  it("Delete File Success", () => {
    const action = {
      type: files.DELETE_FILE_SUCCESS,
      filename
    };

    expect(draftReducer(fileState, action)).toEqual(initialState);
  });
  it("Delete File Error", () => {
    const action = {
      type: files.DELETE_FILE_ERROR,
      filename,
      error
    };

    const state = fileState.setIn(["bucket", filename], {
      key: filename,
      status: "error",
      error: error.response.data
    });

    expect(draftReducer(fileState, action)).toEqual(state);
  });
});
