import { Map } from "immutable";

import * as commonActions from "../actions/common"; // Common Actions
import * as draftItemActions from "../actions/draftItem"; // Drafts Actions
import * as filesActions from "../actions/files"; // Files Actions

const initialState = Map({
  errors: [],
  actionsLayer: false,
  showPreviewer: false,
  filePreviewEditLayer: true,
  filePreviewEdit: {},

  bucket: Map({}),
  formData: null,
  // From backend: deposit resource
  access: null,
  can_admin: false,
  can_update: false,
  created: null,
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

export default function draftsReducer(state = initialState, action) {
  switch (action.type) {
    case draftItemActions.TOGGLE_ACTIONS_LAYER:
      return state.set("actionsLayer", !state.get("actionsLayer"));
    case draftItemActions.TOGGLE_PREVIEWER:
      return state.set("showPreviewer", !state.get("showPreviewer"));
    case draftItemActions.TOGGLE_FILE_PREVIEW_EDIT:
        return state
          .set("filePreviewEditLayer", !state.get("filePreviewEditLayer"))
          .set("filePreviewEdit", action.payload);
    case draftItemActions.INIT_FORM:
      return state.merge(initialState);
    case draftItemActions.CLEAR_ERROR_SUCCESS:
      return state.set("errors", []);
    case commonActions.FETCH_SCHEMA_SUCCESS:
      const { schemaId, ...schemas } = action.schema;
      return state.set("schema", schemaId).set("schemas", schemas);
    case draftItemActions.FORM_DATA_CHANGE:
      return state.set("formData", action.data);
    case filesActions.TOGGLE_FILEMANAGER_LAYER:
      return state.set(
        "fileManagerActiveLayer",
        !state.get("fileManagerActiveLayer")
      );

    // Draft Metadata
    case draftItemActions.DRAFTS_ITEM_SUCCESS:
      return state
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    case draftItemActions.DRAFTS_ITEM_ERROR:
      return state.set("errors", action.error);
    case draftItemActions.CREATE_DRAFT_SUCCESS:
      return state
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    case draftItemActions.CREATE_DRAFT_ERROR:
      return state.set("errors", [...state.get("errors"), action.error]);

    case draftItemActions.UPDATE_DRAFT_REQUEST:
      return state
        .setIn(["current_item", "loading"], true)
        .setIn(["current_item", "message"], { msg: "Updating.." });
    case draftItemActions.UPDATE_DRAFT_SUCCESS:
      return state
        .set("formData", action.draft.metadata)
        .set("message", {
          status: "ok",
          msg: "All changes saved"
        })
        .merge(Map(action.draft));
    case draftItemActions.UPDATE_DRAFT_ERROR:
      return state
        .set("loading", false)
        .set("errors", [...state.get("errors"), action.error])
        .set("message", {
          status: "critical",
          msg: "Error while updating.."
        });

    case draftItemActions.DELETE_DRAFT_REQUEST:
      return state.set("loading", true);
    case draftItemActions.DELETE_DRAFT_SUCCESS:
      return state.set(initialState);
    case draftItemActions.DELETE_DRAFT_ERROR:
      return state
        .set("loading", false)
        .set("errors", [...state.get("errors"), action.error]);

    case draftItemActions.DISCARD_DRAFT_REQUEST:
      return state.set("loading", true);
    case draftItemActions.DISCARD_DRAFT_SUCCESS:
      return state
        .set("loading", false)
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    // case draftItemActions.DISCARD_DRAFT_ERROR:
    // 	return state
    // 		.set("loading", false)
    // 		.set("error", action.error);
    case draftItemActions.EDIT_PUBLISHED_REQUEST:
      return state.set("loading", true);
    // .set("error", null);
    case draftItemActions.EDIT_PUBLISHED_SUCCESS:
      return state
        .set("loading", false)
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    // case draftItemActions.EDIT_PUBLISHED_ERROR:
    // 	return state
    // 		.set("loading", false)
    // 		.set("error", action.error);
    case draftItemActions.PUBLISH_DRAFT_REQUEST:
      return state.set("loading", true);
    case draftItemActions.PUBLISH_DRAFT_SUCCESS:
      return state
        .set("loading", false)
        .set("formData", action.draft.metadata)
        .merge(Map(action.draft));
    case draftItemActions.PUBLISH_DRAFT_ERROR:
      return state.set("loading", false);

    case draftItemActions.GENERAL_TITLE_REQUEST:
      return state.set("generalTitleLoading", true);
    case draftItemActions.GENERAL_TITLE_SUCCESS:
      return state.merge(Map(action.draft)).set("generalTitleLoading", false);
    case draftItemActions.GENERAL_TITLE_ERROR:
      return state.set("generalTitleLoading", false);

    // Access
    case draftItemActions.PERMISSIONS_ITEM_REQUEST:
      return state.set("loading", true);
    case draftItemActions.PERMISSIONS_ITEM_SUCCESS:
      return state.set("access", action.permissions).set("loading", false);
    case draftItemActions.PERMISSIONS_ITEM_ERROR:
      return state
        .set("loading", false)
        .set("errors", action.error.response.data);

    // Files
    case filesActions.BUCKET_ITEM_REQUEST:
      return state.set("loading", true);
    case filesActions.BUCKET_ITEM_SUCCESS:
      return state
        .set("loading", false)
        .set(
          "bucket",
          action.bucket.contents.length > 0
            ? Map(action.bucket.contents.map(item => [item.key, item]))
            : Map({})
        );
    case filesActions.BUCKET_ITEM_ERROR:
      return state
        .set("loading", false)
        .set("error", [...state.get("errors"), action.error]);

    case filesActions.UPLOAD_FILE_REQUEST:
      return state.setIn(["bucket", action.filename], {
        key: action.filename,
        status: "uploading",
      });
    case filesActions.UPLOAD_FILE_SUCCESS:
      return state.setIn(["bucket", action.filename], {
        key: action.filename,
        status: "done",
        mimetype: action.data.mimetype,
        data:action.data
      });
    case filesActions.UPLOAD_FILE_ERROR:
      return state.setIn(["bucket", action.filename], {
        key: action.filename,
        status: "error",
        error: action.error.response.data
      });
    case filesActions.DELETE_FILE_REQUEST:
      return state.setIn(["bucket", action.filename], {
        key: action.filename,
        status: "deleting"
      });
    case filesActions.DELETE_FILE_SUCCESS:
      return state.removeIn(["bucket", action.filename]);
    case filesActions.DELETE_FILE_ERROR:
      return state.setIn(["bucket", action.filename], {
        key: action.filename,
        status: "error",
        error: action.error.response.data
      });

    default:
      return state;
  }
}
