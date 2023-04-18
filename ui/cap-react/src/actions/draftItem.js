import axios from "axios";
import { push } from "connected-react-router";
import { fetchAndAssignSchema, formErrorsChange } from "./common";
import { getBucketByUri, getBucketById } from "./files";
import { notification } from "antd";

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

export const REVIEW_DRAFT_REQUEST = "REVIEW_DRAFT_REQUEST";
export const REVIEW_DRAFT_SUCCESS = "REVIEW_DRAFT_SUCCESS";
export const REVIEW_DRAFT_ERROR = "REVIEW_DRAFT_ERROR";
export const CLEAR_REVIEW_DRAFT_ERROR = "CLEAR_REVIEW_DRAFT_ERROR";

export const EDIT_PUBLISHED_REQUEST = "EDIT_PUBLISHED_REQUEST";
export const EDIT_PUBLISHED_SUCCESS = "EDIT_PUBLISHED_SUCCESS";
export const EDIT_PUBLISHED_ERROR = "EDIT_PUBLISHED_ERROR";

export const PERMISSIONS_ITEM_REQUEST = "PERMISSIONS_ITEM_REQUEST";
export const PERMISSIONS_ITEM_SUCCESS = "PERMISSIONS_ITEM_SUCCESS";

export const REMOVE_LOADING = "REMOVE_LOADING";

// TOFIX Consider using a HOC for error handling
export const CLEAR_ERRORS = "CLEAR_ERRORS";

export const FORM_DATA_CHANGE = "FORM_DATA_CHANGE";

export const draftsItemRequest = () => ({ type: DRAFTS_ITEM_REQUEST });
export const draftsItemSuccess = (draft_id, draft) => ({
  type: DRAFTS_ITEM_SUCCESS,
  draft_id,
  draft,
});
export const draftsItemError = error => ({ type: DRAFTS_ITEM_ERROR, error });

export const publishDraftRequest = () => ({ type: PUBLISH_DRAFT_REQUEST });
export const publishDraftSuccess = draft => ({
  type: PUBLISH_DRAFT_SUCCESS,
  draft,
});
export const publishDraftError = (errors = null) => ({
  type: PUBLISH_DRAFT_ERROR,
  errors,
});

export const remove_loading = () => ({
  type: REMOVE_LOADING,
});

export const initForm = () => ({ type: INIT_FORM });

export const toggleFilemanagerLayer = (
  selectable = false,
  action = null,
  active = null,
  message = null
) => ({
  type: TOGGLE_FILEMANAGER_LAYER,
  selectable,
  action,
  active,
  message,
});

export const toggleActionsLayer = (actionType = null) => ({
  type: TOGGLE_ACTIONS_LAYER,
  actionType,
});
export const togglePreviewer = () => ({ type: TOGGLE_PREVIEWER });
export const toggleSidebar = () => ({ type: TOGGLE_SIDEBAR });
export const toggleLiveValidate = () => ({ type: TOGGLE_LIVE_VALIDATE });
export const toggleCustomValidation = () => ({
  type: TOGGLE_CUSTOM_VALIDATION,
});

export function toggleFilePreviewEdit(payload = {}) {
  return {
    type: TOGGLE_FILE_PREVIEW_EDIT,
    payload,
  };
}

export const toggleValidate = () => ({ type: TOGGLE_VALIDATE });

export const formDataChange = data => ({ type: FORM_DATA_CHANGE, data });

export const generalTitleChange = title => ({
  type: GENERAL_TITLE_CHANGED,
  title,
});
export const generalTitleRequest = () => ({ type: GENERAL_TITLE_REQUEST });
export const generalTitleSuccess = draft => ({
  type: GENERAL_TITLE_SUCCESS,
  draft,
});
export const generalTitleError = error => ({
  type: GENERAL_TITLE_ERROR,
  error,
});

export const createDraftRequest = () => ({ type: CREATE_DRAFT_REQUEST });
export const createDraftSuccess = draft => ({
  type: CREATE_DRAFT_SUCCESS,
  draft,
});
export const createDraftError = () => ({ type: CREATE_DRAFT_ERROR });

export const deleteDraftRequest = () => ({ type: DELETE_DRAFT_REQUEST });
export const deleteDraftSuccess = () => ({ type: DELETE_DRAFT_SUCCESS });
export const deleteDraftError = () => ({ type: DELETE_DRAFT_ERROR });

export const updateDraftRequest = () => ({ type: UPDATE_DRAFT_REQUEST });
export const updateDraftSuccess = (draft_id, draft) => ({
  type: UPDATE_DRAFT_SUCCESS,
  draft_id,
  draft,
});
export const updateDraftError = error => ({
  type: UPDATE_DRAFT_ERROR,
  error,
});

export const discardDraftRequest = () => ({ type: DISCARD_DRAFT_REQUEST });
export const discardDraftSuccess = (draft_id, draft) => ({
  type: DISCARD_DRAFT_SUCCESS,
  draft_id,
  draft,
});
export const discardDraftError = error => ({
  type: DISCARD_DRAFT_ERROR,
  error,
});

export const reviewDraftRequest = () => ({ type: REVIEW_DRAFT_REQUEST });
export const reviewDraftSuccess = (draft_id, draft) => ({
  type: REVIEW_DRAFT_SUCCESS,
  draft_id,
  draft,
});
export const reviewDraftError = error => ({
  type: REVIEW_DRAFT_ERROR,
  error,
});

export const clearDraftReviewErrors = () => ({
  type: CLEAR_REVIEW_DRAFT_ERROR,
});

export const editPublishedRequest = () => ({ type: EDIT_PUBLISHED_REQUEST });
export const editPublishedSuccess = (draft_id, draft) => ({
  type: EDIT_PUBLISHED_SUCCESS,
  draft_id,
  draft,
});
export const editPublishedError = error => ({
  type: EDIT_PUBLISHED_ERROR,
  error,
});

export const permissionsItemRequest = () => ({
  type: PERMISSIONS_ITEM_REQUEST,
});
export const permissionsItemSuccess = permissions => ({
  type: PERMISSIONS_ITEM_SUCCESS,
  permissions,
});

export const clearErrors = () => ({ type: CLEAR_ERRORS });

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

// Create Draft
export function createDraft(data = {}, ana_type) {
  return (dispatch, getState) => {
    //TODO
    // this might be obsolete check since we do not allow from the frontend to
    // create a draft without anatype
    if (!ana_type.name) {
      notification.warning({
        message: "Form is not ready",
        description: "Make sure you selected a type for your analysis",
      });
      return;
    }
    return dispatch(postCreateDraft(data, ana_type))
      .then(() => {
        let state = getState();
        const draft_id = state.draftItem.get("id");
        dispatch(push(`/drafts/${draft_id}/edit`));
      })
      .catch(error => {
        // probably is not used should be checked with tests
        // in order to validate that is not used
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
          "Cache-Control": "no-cache",
        },
      })
      .then(response => {
        let draft = response.data;
        if (draft.id) {
          dispatch(createDraftSuccess(response.data));
          notification.success({
            message: "You started a new analysis.",
          });
        }
      })
      .catch(error => {
        dispatch(createDraftError());
        notification.error({
          message: "Something went wrong",
          description: error.response.data.message,
        });
        throw error;
      });
  };
}

export function updateGeneralTitle(title) {
  return (dispatch, getState) => {
    const draft_id = getState().draftItem.get("id");

    if (draft_id) return dispatch(patchGeneralTitle(draft_id, title));
  };
}

export function patchGeneralTitle(draft_id, title) {
  return (dispatch, getState) => {
    dispatch(generalTitleRequest());

    const general_title = getState().draftItem.get("metadata").general_title;

    let uri = "/api/deposits/" + draft_id;

    let patch_data = [
      {
        op: general_title ? "replace" : "add",
        path: "/general_title",
        value: title,
      },
    ];
    return axios
      .patch(uri, patch_data, {
        headers: { "Content-Type": "application/json-patch+json" },
      })
      .then(response => {
        if (response.status == 200) {
          dispatch(generalTitleSuccess(response.data));
          notification.success({
            message: "General Title",
            description: "Your Title has successfully changed",
          });
        }
      })
      .catch(error => {
        dispatch(generalTitleError(error.response));
        notification.error({
          message: "Your title was not changed",
          description: error.response.data.message,
        });
      });
  };
}

export function editPublished(data = {}, draft_id) {
  return dispatch => {
    return dispatch(postAndPutPublished(data, draft_id)).catch(error => {
      dispatch(dispatch(editPublishedError(error.response)));
      throw error;
    });
  };
}

export const publishedToDraftStatus = draft_id => dispatch => {
  dispatch(editPublishedRequest());
  let uri = `/api/deposits/${draft_id}/actions/edit`;
  return axios
    .post(uri)
    .then(resp => {
      dispatch(editPublishedSuccess(draft_id, resp.data));
      notification.success({
        message: "Draft Status",
        description: "Your record status successfully changed to Draft",
      });
    })
    .catch(error => {
      notification.error({
        message: error.message,
        description:
          "There is an error, please make sure you are connected and try again",
      });

      throw error;
    });
};

export function postAndPutPublished(data = {}, draft_id) {
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
            notification.success({
              message: "Draft updated",
              description: "Your data has been updated",
            });
          })
          .catch(error => {
            dispatch(updateDraftError(error));
            notification.error({
              message: error.message,
              description:
                "There is an error, please make sure you are connected and try again",
            });
            throw error;
          });
      })
      .catch(error => {
        notification.error({
          message: error.message,
          description:
            "There is an error, please make sure you are connected and try again",
        });
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
        notification.success({
          message: "Data discarded",
          description: "Your data has been discarded",
        });
      })
      .catch(error => {
        dispatch(discardDraftError(error));
        notification.error({
          message: error.message,
          description:
            "There is an error, please make sure you are connected and try again",
        });
      });
  };
}

export function reviewDraft(draft_id, review, message = "submitted") {
  return dispatch => {
    dispatch(reviewDraftRequest());

    let uri = `/api/deposits/${draft_id}/actions/review`;

    return axios
      .post(uri, review, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/form+json",
        },
      })
      .then(response => {
        notification.success({
          message: "Review Submission",
          description: `Your review has been ${message}`,
        });
        return dispatch(reviewDraftSuccess(draft_id, response.data));
      })
      .catch(error => {
        return dispatch(reviewDraftError(error.response.data));
      });
  };
}

export function updateDraft(data, draft_id) {
  return dispatch => {
    return dispatch(putUpdateDraft(data, draft_id)).catch(error => {
      dispatch(updateDraftError(error));
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
        notification.success({
          message: "Draft saved",
          description: "Your Draft has been updated successfully",
        });
      })
      .catch(error => {
        let errorHeading = "Error while updating";
        let errorDescription;
        let errorThrow = "Error while updating";

        if (error.response.status == 422) {
          let _errors = error.response.data.errors;
          let errorTree = {};
          _errors.map(e => {
            let tmp = errorTree;
            e.field.map(field => {
              if (!tmp[field]) tmp[field] = {};
              tmp = tmp[field];
            });

            if (!tmp["__errors"]) tmp["__errors"] = [];
            tmp["__errors"].push(e.message);
          });

          dispatch(formErrorsChange(_toErrorList(errorTree)));
          errorHeading = "Validation Error while updating";
          errorDescription = "Please fix the errors before saving again";
          errorThrow = errorTree;
          throw errorThrow;
        } else if (
          error.response.status == 403 &&
          error.response.data &&
          error.response.data.message == "Invalid action"
        ) {
          errorDescription =
            "Either you need permissions or you are trying to publish an already published item";
        } else if (error.response) {
          errorDescription =
            error.response.data && error.response.data.message
              ? error.response.data.message
              : "";
        } else if (error.request) {
          // client never received a response, or request never left
          errorHeading = "Something went wrong";
          errorDescription =
            "There is an error, please make sure you are connected and try again";
        } else {
          // anything else
        }
        notification.error({
          message: errorHeading,
          description: errorDescription,
        });
        throw null;
      });
  };
}

let _toErrorList = function (errorSchema, fieldName = "root") {
  // XXX: We should transform fieldName as a full field path string.
  let errorList = [];
  if ("__errors" in errorSchema) {
    errorList = errorList.concat(
      errorSchema.__errors.map(() => {
        return `${fieldName}`;
      })
    );
  }
  return Object.keys(errorSchema).reduce((acc, key) => {
    if (key !== "__errors") {
      acc = acc.concat(_toErrorList(errorSchema[key], fieldName + "_" + key));
    }
    return acc;
  }, errorList);
};

export function postPublishDraft() {
  return (dispatch, getState) => {
    dispatch(publishDraftRequest());
    let state = getState();

    let links = state.draftItem.get("links");
    // let uri = `/api/deposits/${draft_id}/actions/publish`;

    notification.info({
      key: "publishing",
      message: "Publishing in progress...",
    });

    return axios
      .post(links.publish)
      .then(response => {
        dispatch(publishDraftSuccess(response.data));
        notification.success({
          key: "publishing",
          message: "Draft published",
          description: "Your Draft has been successfully published",
        });
      })
      .catch(error => {
        let errorHeading = "Error while publishing";
        let errorDescription;
        let errorThrow = "Error while publishing";

        if (error.response.status == 422) {
          let _errors = error.response.data.errors;
          let errorTree = {};
          _errors.map(e => {
            let tmp = errorTree;
            e.field.map(field => {
              if (!tmp[field]) tmp[field] = {};
              tmp = tmp[field];
            });

            if (!tmp["__errors"]) tmp["__errors"] = [];
            tmp["__errors"].push(e.message);
          });

          dispatch(formErrorsChange(_toErrorList(errorTree)));
          errorHeading = "Validation Error while publishing";
          errorDescription =
            "Please fix the errors in 'Edit' tab before publishing again";
          errorThrow = errorTree;
        } else if (
          error.response.status == 403 &&
          error.response.data &&
          error.response.data.message == "Invalid action"
        ) {
          errorDescription =
            "Either you need permissions or you are trying to publish an already published item";
        } else if (error.response) {
          errorDescription =
            error.response.data && error.response.data.message
              ? error.response.data.message
              : "";
        } else if (error.request) {
          // client never received a response, or request never left
          errorHeading = "Something went wrong";
          errorDescription =
            "There is an error, please make sure you are connected and try again";
        } else {
          // anything else
        }
        notification.error({
          key: "publishing",
          message: errorHeading,
          description: errorDescription,
        });

        throw errorThrow;
      });
  };
}

export function publishDraft(draft_id) {
  return dispatch => {
    dispatch(postPublishDraft(draft_id))
      .then(() => {})
      .catch(error => {
        dispatch(publishDraftError(error));
      });
  };
}

export function deleteDraft() {
  return (dispatch, getState) => {
    dispatch(deleteDraftRequest());
    let state = getState();

    let links = state.draftItem.get("links");

    // let uri = `/api/deposits/${draft_id}`;

    // when deleting, send the request and wait 1sec for the ElasticSearch to complete re-indexing
    notification.info({
      message: "Deleting Draft....",
      key: "deleting",
    });
    axios
      .delete(links.self)
      .then(() => {
        dispatch(push("/"));
        notification.success({
          key: "deleting",
          message: "Draft deleted",
          description: "Your Draft has been deleted",
        });
        dispatch(deleteDraftSuccess());
      })
      .catch(error => {
        dispatch(deleteDraftError());
        notification.error({
          key: "deleting",
          message: error.message,
          description:
            "There is an error, please make sure you are connected and try again",
        });
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
        dispatch(remove_loading());
        notification.error({
          description: error.response.data.message,
        });
      });
  };
}

function _get_permissions_data(type, email, action, operation) {
  return Array.isArray(action)
    ? action.map(item => ({
        type: `${type}`,
        email: `${email}`,
        op: `${operation}`,
        action: `${item}`,
      }))
    : [
        {
          type: `${type}`,
          email: `${email}`,
          op: `${operation}`,
          action: `${action}`,
        },
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
          "Cache-Control": "no-cache",
        },
      })
      .then(response => {
        let {
          links: { bucket: bucket_link = null },
        } = response.data;

        // remove files field from the response data
        delete response.data["files"];

        dispatch(draftsItemSuccess(draft_id, { ...response.data }));
        if (bucket_link) dispatch(getBucketByUri(bucket_link));
      })
      .catch(error => {
        // TOFIX: the response for 403 was an html we need to it this way
        // when response for 403 will be json to fix
        let e = {
          status: error.response ? error.response.status : "400",
          message: error.response
            ? error.response.data.message
              ? error.response.data.message
              : null
            : "Something went wrong with your request. Please try again",
        };
        dispatch(draftsItemError(e));
      });
  };
}

// ********************************************************
// ********************************************************
// Functions that are deceprecated and about to be deleted
// ********************************************************
// ********************************************************
export function getDraftById(draft_id, fetchSchemaFlag = false) {
  return dispatch => {
    dispatch(draftsItemRequest());

    let uri = `/api/deposits/${draft_id}`;

    axios
      .get(uri, {
        headers: {
          "Content-Type": "application/json",
        },
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
                "Something went wrong with your request. Please try again",
            };

        dispatch(draftsItemError(e));
      });
  };
}
