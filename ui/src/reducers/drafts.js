import { Map } from "immutable";

import {
  TOGGLE_FILEMANAGER_LAYER,
  TOGGLE_PREVIEWER,
  TOGGLE_LIVE_VALIDATE,
  TOGGLE_CUSTOM_VALIDATION,
  TOGGLE_VALIDATE,
  TOGGLE_SIDEBAR,
  TOGGLE_ACTIONS_LAYER,
  FETCH_SCHEMA_REQUEST,
  FETCH_SCHEMA_SUCCESS,
  FETCH_SCHEMA_ERROR,
  DRAFTS_ITEM_REQUEST,
  DRAFTS_ITEM_SUCCESS,
  DRAFTS_ITEM_ERROR,
  CREATE_DRAFT_REQUEST,
  CREATE_DRAFT_SUCCESS,
  CREATE_DRAFT_ERROR,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_ERROR,
  INIT_FORM,
  PUBLISH_DRAFT_REQUEST,
  PUBLISH_DRAFT_SUCCESS,
  PUBLISH_DRAFT_ERROR,
  DELETE_DRAFT_REQUEST,
  DELETE_DRAFT_SUCCESS,
  DELETE_DRAFT_ERROR,
  DISCARD_DRAFT_REQUEST,
  DISCARD_DRAFT_SUCCESS,
  DISCARD_DRAFT_ERROR,
  EDIT_PUBLISHED_REQUEST,
  EDIT_PUBLISHED_SUCCESS,
  EDIT_PUBLISHED_ERROR,
  UPDATE_DRAFT_REQUEST,
  UPDATE_DRAFT_SUCCESS,
  UPDATE_DRAFT_ERROR,
  PERMISSIONS_ITEM_REQUEST,
  PERMISSIONS_ITEM_SUCCESS,
  PERMISSIONS_ITEM_ERROR,
  CLEAR_ERROR_SUCCESS,
  FORM_DATA_CHANGE
} from "../actions/drafts";

const initialState = Map({
  schema: null,
  uiSchema: null,
  data: {},
  selectedSchema: null,
  fileManagerActiveLayer: false,
  fileManagerLayerSelectable: false,
  fileManagerLayerSelectableAction: null,
  actionsLayer: false,
  showPreviewer: false,
  showSidebar: true,
  liveValidate: true,
  validate: true,
  customValidation: false,
  current_item: Map({
    id: null,
    published_id: null,
    data: null,
    formData: {},
    files: Map({}),
    loading: false,
    message: null,
    error: null,
    links: null,
    permissions: {}
  })
});
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function depositReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_FILEMANAGER_LAYER:
      return state
        .set("fileManagerActiveLayer", !state.get("fileManagerActiveLayer"))
        .set("fileManagerLayerSelectable", action.selectable)
        .set("fileManagerLayerSelectableAction", action.action);
    case TOGGLE_ACTIONS_LAYER:
      return state.set("actionsLayer", !state.get("actionsLayer"));
    case TOGGLE_PREVIEWER:
      return state.set("showPreviewer", !state.get("showPreviewer"));
    case TOGGLE_SIDEBAR:
      return state.set("showSidebar", !state.get("showSidebar"));
    case TOGGLE_LIVE_VALIDATE:
      return state.set("liveValidate", !state.get("liveValidate"));
    case TOGGLE_CUSTOM_VALIDATION:
      return state.set("customValidation", !state.get("customValidation"));
    case TOGGLE_VALIDATE:
      return state.set("validate", !state.get("validate"));
    case FETCH_SCHEMA_REQUEST:
      return state.set("loading", true).set("error", null);
    case FETCH_SCHEMA_SUCCESS:
      return state
        .set("loading", false)
        .set("schema", action.schema.schema)
        .set("uiSchema", action.schema.uiSchema);
    case FETCH_SCHEMA_ERROR:
      return state.set("loading", false).set("error", action.error);
    case DRAFTS_ITEM_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], null);
    case DRAFTS_ITEM_SUCCESS:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "id"], action.draft_id)
        .setIn(["current_item", "data"], action.draft.metadata)
        .setIn(["current_item", "formData"], action.draft.metadata)
        .setIn(["current_item", "permissions"], action.permissions)
        .setIn(
          ["current_item", "files"],
          action.draft.files
            ? Map(action.draft.files.map(item => [item.key, item]))
            : Map({})
        )
        .setIn(["current_item", "links"], Map(action.draft.links));
    case DRAFTS_ITEM_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case CREATE_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "message"], { msg: "Creating.." })
        .setIn(["current_item", "error"], null);
    case CREATE_DRAFT_SUCCESS:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "message"], { status: "ok", msg: "Created!" })
        .setIn(["current_item", "error"], null)
        .setIn(["current_item", "id"], action.draft_id)
        .setIn(["current_item", "data"], action.draft.metadata)
        .setIn(["current_item", "permissions"], action.permissions)
        .setIn(["current_item", "formData"], action.draft.metadata)
        .setIn(["current_item", "links"], Map(action.draft.links));
    case CREATE_DRAFT_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "message"], {
          status: "critical",
          msg: "Error while creating.."
        });
    case UPDATE_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "message"], { msg: "Updating.." });
    case UPDATE_DRAFT_SUCCESS:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "message"], { status: "ok", msg: "Saved!" });
    case UPDATE_DRAFT_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "message"], {
          status: "critical",
          msg: "Error while updating.."
        });
    case INIT_FORM:
      return state.set(
        "current_item",
        Map({
          id: null,
          data: null,
          loading: false,
          error: null,
          links: null,
          files: Map({})
        })
      );
    case UPLOAD_FILE_REQUEST:
      return state.setIn(["current_item", "files", action.filename], {
        key: action.filename,
        status: "uploading"
      });
    case UPLOAD_FILE_SUCCESS:
      return state.setIn(["current_item", "files", action.filename], {
        key: action.filename,
        status: "done"
      });
    case UPLOAD_FILE_ERROR:
      return state.setIn(["current_item", "files", action.filename], {
        key: action.filename,
        status: "error",
        error: action.error.response.data
      });
    case PUBLISH_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], false);
    case PUBLISH_DRAFT_SUCCESS:
      return state
        .setIn(["current_item", "published_id"], action.published_id)
        .setIn(["current_item", "data"], action.published_record);
    case PUBLISH_DRAFT_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case DELETE_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], false);
    case DELETE_DRAFT_SUCCESS:
      return state
        .setIn(["current_item", "id"], null)
        .setIn(["current_item", "data"], null);
    case DELETE_DRAFT_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case DISCARD_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], false);
    case DISCARD_DRAFT_SUCCESS:
      return state
        .setIn(["current_item", "id"], action.draft_id)
        .setIn(["current_item", "published_id"], null)
        .setIn(["current_item", "data"], action.data)
        .setIn(["current_item", "formData"], action.data);
    case DISCARD_DRAFT_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case EDIT_PUBLISHED_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], false);
    case EDIT_PUBLISHED_SUCCESS:
      return state
        .setIn(["current_item", "id"], action.draft_id)
        .setIn(["current_item", "published_id"], null)
        .setIn(["current_item", "data"], action.draft);
    case EDIT_PUBLISHED_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error);
    case PERMISSIONS_ITEM_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "error"], false);
    case PERMISSIONS_ITEM_SUCCESS:
      return state
        .setIn(["current_item", "permissions"], action.permissions)
        .setIn(["current_item", "loading"], false);
    case PERMISSIONS_ITEM_ERROR:
      return state
        .setIn(["current_item", "loading"], false)
        .setIn(["current_item", "error"], action.error.response.data);
    case CLEAR_ERROR_SUCCESS:
      return state.setIn(["current_item", "error"], null);
    case FORM_DATA_CHANGE:
      return state.setIn(["current_item", "formData"], action.data);
    default:
      return state;
  }
}
