import axios from "axios";
import { replace, push } from "react-router-redux";
import { fetchAndAssignSchema } from "./common";
import { getBucketByUri, getBucketById } from "./files";

export const TOGGLE_FILEMANAGER_LAYER = "TOGGLE_FILEMANAGER_LAYER";
export const TOGGLE_PREVIEWER = "TOGGLE_PREVIEWER";
export const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";
export const TOGGLE_LIVE_VALIDATE = "TOGGLE_LIVE_VALIDATE";
export const TOGGLE_CUSTOM_VALIDATION = "TOGGLE_CUSTOM_VALIDATION";
export const TOGGLE_VALIDATE = "TOGGLE_VALIDATE";
export const TOGGLE_ACTIONS_LAYER = "TOGGLE_ACTIONS_LAYER";
export const TOGGLE_FILE_PREVIEW_EDIT = "TOGGLE_FILE_PREVIEW_EDIT";

export const GENERAL_TITLE_CHANGED = "GENERAL_TITLE_CHANGED";
export const GENERAL_TITLE_REQUEST = "GENERAL_TITLE_REQUEST";
export const GENERAL_TITLE_SUCCESS = "GENERAL_TITLE_SUCCESS";
export const GENERAL_TITLE_ERROR = "GENERAL_TITLE_ERROR";

export const INIT_FORM = "INIT_FORM";

export const DRAFTS_ITEM_REQUEST = "DRAFTS_ITEM_REQUEST";
export const DRAFTS_ITEM_SUCCESS = "DRAFTS_ITEM_SUCCESS";
export const DRAFTS_ITEM_ERROR = "DRAFTS_ITEM_ERROR";

export const PUBLISH_DRAFT_REQUEST = "PUBLISH_DRAFT_REQUEST";
export const PUBLISH_DRAFT_SUCCESS = "PUBLISH_DRAFT_SUCCESS";
export const PUBLISH_DRAFT_ERROR = "PUBLISH_DRAFT_ERROR";

export const CREATE_DRAFT_REQUEST = "CREATE_DRAFT_REQUEST";
export const CREATE_DRAFT_SUCCESS = "CREATE_DRAFT_SUCCESS";
export const CREATE_DRAFT_ERROR = "CREATE_DRAFT_ERROR";

export const DELETE_DRAFT_REQUEST = "DELETE_DRAFT_REQUEST";
export const DELETE_DRAFT_SUCCESS = "DELETE_DRAFT_SUCCESS";
export const DELETE_DRAFT_ERROR = "DELETE_DRAFT_ERROR";

export const UPDATE_DRAFT_REQUEST = "UPDATE_DRAFT_REQUEST";
export const UPDATE_DRAFT_SUCCESS = "UPDATE_DRAFT_SUCCESS";
export const UPDATE_DRAFT_ERROR = "UPDATE_DRAFT_ERROR";

export const DISCARD_DRAFT_REQUEST = "DISCARD_DRAFT_REQUEST";
export const DISCARD_DRAFT_SUCCESS = "DISCARD_DRAFT_SUCCESS";
export const DISCARD_DRAFT_ERROR = "DISCARD_DRAFT_ERROR";

export const EDIT_PUBLISHED_REQUEST = "EDIT_PUBLISHED_REQUEST";
export const EDIT_PUBLISHED_SUCCESS = "EDIT_PUBLISHED_SUCCESS";
export const EDIT_PUBLISHED_ERROR = "EDIT_PUBLISHED_ERROR";

export const PERMISSIONS_ITEM_REQUEST = "PERMISSIONS_ITEM_REQUEST";
export const PERMISSIONS_ITEM_SUCCESS = "PERMISSIONS_ITEM_SUCCESS";
export const PERMISSIONS_ITEM_ERROR = "PERMISSIONS_ITEM_ERROR";

// TOFIX Consider using a HOC for error handling
export const CLEAR_ERROR_SUCCESS = "CLEAR_ERROR_SUCCESS";

export const FORM_DATA_CHANGE = "FORM_DATA_CHANGE";

export const draftsItemRequest = () => ({ type: DRAFTS_ITEM_REQUEST });
export const draftsItemSuccess = (draft_id, draft) => ({
  type: DRAFTS_ITEM_SUCCESS,
  draft_id,
  draft
});
export const draftsItemError = error => ({ type: DRAFTS_ITEM_ERROR, error });

export const publishDraftRequest = () => ({ type: PUBLISH_DRAFT_REQUEST });
export const publishDraftSuccess = (published_id, draft) => ({
  type: PUBLISH_DRAFT_SUCCESS,
  published_id,
  draft
});
export const publishDraftError = error => ({
  type: PUBLISH_DRAFT_ERROR,
  error
});

export const initForm = () => ({ type: INIT_FORM });

export const toggleFilemanagerLayer = (selectable = false, action = null) => ({
  type: TOGGLE_FILEMANAGER_LAYER,
  selectable,
  action
});

export const toggleActionsLayer = () => ({ type: TOGGLE_ACTIONS_LAYER });
export const togglePreviewer = () => ({ type: TOGGLE_PREVIEWER });
export const toggleSidebar = () => ({ type: TOGGLE_SIDEBAR });
export const toggleLiveValidate = () => ({ type: TOGGLE_LIVE_VALIDATE });
export const toggleCustomValidation = () => ({
  type: TOGGLE_CUSTOM_VALIDATION
});
export function toggleFilePreviewEdit(payload = {}) {
  return {
    type: TOGGLE_FILE_PREVIEW_EDIT,
    payload
  };
}
export const toggleValidate = () => ({ type: TOGGLE_VALIDATE });

export const formDataChange = data => ({ type: FORM_DATA_CHANGE, data });

export const generalTitleChange = title => ({
  type: GENERAL_TITLE_CHANGED,
  title
});
export const generalTitleRequest = () => ({ type: GENERAL_TITLE_REQUEST });
export const generalTitleSuccess = draft => ({
  type: GENERAL_TITLE_SUCCESS,
  draft
});
export const generalTitleError = error => ({
  type: GENERAL_TITLE_ERROR,
  error
});

export const createDraftRequest = () => ({ type: CREATE_DRAFT_REQUEST });
export const createDraftSuccess = draft => ({
  type: CREATE_DRAFT_SUCCESS,
  draft
});
export const createDraftError = error => ({ type: CREATE_DRAFT_ERROR, error });

export const deleteDraftRequest = () => ({ type: DELETE_DRAFT_REQUEST });
export const deleteDraftSuccess = () => ({ type: DELETE_DRAFT_SUCCESS });
export const deleteDraftError = error => ({ type: DELETE_DRAFT_ERROR, error });

export const updateDraftRequest = () => ({ type: UPDATE_DRAFT_REQUEST });
export const updateDraftSuccess = (draft_id, draft) => ({
  type: UPDATE_DRAFT_SUCCESS,
  draft_id,
  draft
});
export const updateDraftError = error => ({ type: UPDATE_DRAFT_ERROR, error });

export const discardDraftRequest = () => ({ type: DISCARD_DRAFT_REQUEST });
export const discardDraftSuccess = (draft_id, draft) => ({
  type: DISCARD_DRAFT_SUCCESS,
  draft_id,
  draft
});
export const discardDraftError = error => ({
  type: DISCARD_DRAFT_ERROR,
  error
});

export const editPublishedRequest = () => ({ type: EDIT_PUBLISHED_REQUEST });
export const editPublishedSuccess = (draft_id, draft) => ({
  type: EDIT_PUBLISHED_SUCCESS,
  draft_id,
  draft
});
export const editPublishedError = error => ({
  type: EDIT_PUBLISHED_ERROR,
  error
});

export const permissionsItemRequest = () => ({
  type: PERMISSIONS_ITEM_REQUEST
});
export const permissionsItemSuccess = permissions => ({
  type: PERMISSIONS_ITEM_SUCCESS,
  permissions
});
export const permissionsItemError = error => ({
  type: PERMISSIONS_ITEM_ERROR,
  error
});

export const clearErrorSuccess = () => ({ type: CLEAR_ERROR_SUCCESS });

// [TOFIX] Plug validation action if needed.
// export function validate(data, schema) {
//   return dispatch => {
//     dispatch(validateRequest());

//     data['$ana_type'] = schema;

//     axios.post('/api/deposit/validator', data)
//       .then(function(response) {
//         dispatch(validateSuccess(response.data));
//       })
//       .catch(function(error) {
//         dispatch(validateError(error));
//       })
//   };
// }

export function clearError() {
  return dispatch => {
    dispatch(clearErrorSuccess());
  };
}

// Create Draft
export function createDraft(data = {}, ana_type) {
  return (dispatch, getState) => {
    return dispatch(postCreateDraft(data, ana_type))
      .then(() => {
        let state = getState();
        const draft_id = state.draftItem.get("id");
        dispatch(push(`/drafts/${draft_id}/edit`));
      })
      .catch(error => {
        dispatch(createDraftError(error.response));
        throw error;
      });
  };
}
export function postCreateDraft(data = {}, ana_type) {
  return dispatch => {
    dispatch(createDraftRequest());

    let uri = "/api/deposits/";
    data["$ana_type"] = ana_type.name;

    return axios
      .post(uri, data, {
        headers: {
          Accept: "application/form+json",
          "Cache-Control": "no-cache"
        }
      })
      .then(response => {
        let draft = response.data;
        if (draft.id) {
          dispatch(createDraftSuccess(response.data));
        }
      })
      .catch(error => {
        throw error;
      });
  };
}

export function createDraftFromCurrentItem(title, ana_type) {
  return (dispatch, getState) => {
    let state = getState();
    let formData = state.draftItem.get("formData");

    formData["general_title"] = title;

    return dispatch(createDraft(formData, null, ana_type));
  };
}

export function updateGeneralTitle(title, ana_type) {
  return (dispatch, getState) => {
    dispatch(generalTitleRequest());

    const draft_id = getState().draftItem.get("id");

    if (draft_id) return dispatch(patchGeneralTitle(draft_id, title));
    else return dispatch(createDraftFromCurrentItem(title, ana_type));
  };
}

export function patchGeneralTitle(draft_id, title) {
  return (dispatch, getState) => {
    dispatch(generalTitleRequest());

    const general_title = getState().draftItem.getIn([
      "metadata",
      "general_title"
    ]);
    let uri = "/api/deposits/" + draft_id;

    let patch_data = [
      {
        op: general_title ? "replace" : "add",
        path: "/general_title",
        value: title
      }
    ];

    return axios
      .patch(uri, patch_data, {
        headers: { "Content-Type": "application/json-patch+json" }
      })
      .then(response => {
        if (response.status == 200) {
          dispatch(generalTitleSuccess(response.data));
        }
      })
      .catch(error => {
        dispatch(generalTitleError(error.response));
        throw error;
      });
  };
}

export function editPublished(data = {}, schema, draft_id) {
  return dispatch => {
    return dispatch(postAndPutPublished(data, schema, draft_id)).catch(
      error => {
        dispatch(dispatch(editPublishedError(error.response)));
        throw error;
      }
    );
  };
}

export function postAndPutPublished(data = {}, schema, draft_id) {
  return dispatch => {
    dispatch(editPublishedRequest());

    let uri = `/api/deposits/${draft_id}/actions/edit`;

    return axios
      .post(uri)
      .then(resp => {
        dispatch(editPublishedSuccess(draft_id, resp.data.metadata));

        return axios
          .put(`/api/deposits/${draft_id}`, data)
          .then(response => {
            dispatch(updateDraftSuccess(draft_id, response.data));
          })
          .catch(error => {
            throw error;
          });
      })
      .catch(error => {
        throw error;
      });
  };
}

export function discardDraft(draft_id) {
  return dispatch => {
    dispatch(discardDraftRequest());

    let uri = `/api/deposits/${draft_id}/actions/discard`;

    axios
      .post(uri)
      .then(response => {
        dispatch(discardDraftSuccess(draft_id, response.data));
      })
      .catch(error => {
        dispatch(discardDraftError(error));
      });
  };
}

export function updateDraft(data, draft_id) {
  return dispatch => {
    return dispatch(putUpdateDraft(data, draft_id)).catch(error => {
      dispatch(updateDraftError(error.response));
      throw error;
    });
  };
}

export function putUpdateDraft(data, draft_id) {
  return (dispatch, getState) => {
    dispatch(updateDraftRequest());
    let state = getState();

    let links = state.draftItem.get("links");
    // let uri = `/api/deposits/${draft_id}`;

    return axios
      .put(links.self, data)
      .then(response => {
        dispatch(updateDraftSuccess(draft_id, response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function postPublishDraft(draft_id) {
  return (dispatch, getState) => {
    dispatch(publishDraftRequest());
    let state = getState();

    let links = state.draftItem.get("links");
    // let uri = `/api/deposits/${draft_id}/actions/publish`;

    return axios
      .post(links.publish)
      .then(response => {
        let pid = response.data.id;
        dispatch(publishDraftSuccess(pid, response.data));
      })
      .catch(error => {
        throw error.response;
      });
  };
}

export function publishDraft(draft_id) {
  return (dispatch, getState) => {
    dispatch(postPublishDraft(draft_id))
      .then(() => {
        let state = getState();
        const id = state.draftItem.get("recid");
        dispatch(replace(`/published/${id}`));
      })
      .catch(error => {
        dispatch(publishDraftError(error));
        throw error;
      });
  };
}

export function deleteDraft(draft_id) {
  return (dispatch, getState) => {
    dispatch(deleteDraftRequest());
    let state = getState();

    let links = state.draftItem.get("links");
    // let uri = `/api/deposits/${draft_id}`;

    axios
      .delete(links.self)
      .then(() => {
        dispatch(deleteDraftSuccess());
        dispatch(replace("/"));
      })
      .catch(error => {
        dispatch(deleteDraftError(error.response));
      });
  };
}

export function getDraftById(draft_id, fetchSchemaFlag = false) {
  return dispatch => {
    dispatch(draftsItemRequest());

    let uri = `/api/deposits/${draft_id}`;

    axios
      .get(uri, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        let url;

        if (fetchSchemaFlag && response.data.metadata.$schema) {
          url = response.data.metadata.$schema;
          dispatch(fetchAndAssignSchema(url));
        }
        dispatch(draftsItemSuccess(draft_id, response.data));
        let bucket_id = response.data.links.bucket.split("/").pop();
        dispatch(getBucketById(bucket_id));
      })
      .catch(error => {
        const e = error.response
          ? error.response.data
          : {
              status: 400,
              message:
                "Something went wrong with your request. Please try again"
            };

        dispatch(draftsItemError(e));
      });
  };
}

export function handlePermissions(draft_id, type, email, action, operation) {
  return dispatch => {
    dispatch(permissionsItemRequest());
    let data = _get_permissions_data(type, email, action, operation);
    let uri = `/api/deposits/${draft_id}/actions/permissions`;
    axios
      .post(uri, data)
      .then(response => {
        dispatch(permissionsItemSuccess(response.data.access));
      })
      .catch(error => {
        dispatch(permissionsItemError(error));
      });
  };
}

function _get_permissions_data(type, email, action, operation) {
  return [
    {
      type: `${type}`,
      email: `${email}`,
      op: `${operation}`,
      action: `${action}`
    }
  ];
}

export function getDraftByIdAndInitForm(draft_id) {
  return dispatch => {
    dispatch(draftsItemRequest());

    let uri = `/api/deposits/${draft_id}`;

    axios
      .get(uri, {
        headers: {
          Accept: "application/form+json",
          "Cache-Control": "no-cache"
        }
      })
      .then(response => {
        let { files, ...rest } = response.data;
        let {
          links: { bucket: bucket_link = null }
        } = rest;

        dispatch(draftsItemSuccess(draft_id, { ...rest }));
        if (bucket_link) dispatch(getBucketByUri(bucket_link));
      })
      .catch(error => {
        const e = error.response
          ? error.response.data
          : {
              status: 400,
              message:
                "Something went wrong with your request. Please try again"
            };

        dispatch(draftsItemError(e));
      });
  };
}
