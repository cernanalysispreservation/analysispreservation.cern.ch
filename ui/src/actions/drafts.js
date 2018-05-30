import axios from 'axios';
import { replace } from 'react-router-redux';

export const TOGGLE_FILEMANAGER_LAYER = 'TOGGLE_FILEMANAGER_LAYER';
export const TOGGLE_PREVIEWER = 'TOGGLE_PREVIEWER';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const TOGGLE_LIVE_VALIDATE = 'TOGGLE_LIVE_VALIDATE';
export const TOGGLE_CUSTOM_VALIDATION = 'TOGGLE_CUSTOM_VALIDATION';
export const TOGGLE_VALIDATE = 'TOGGLE_VALIDATE';

export const FETCH_SCHEMA_REQUEST = 'FETCH_SCHEMA_REQUEST';
export const FETCH_SCHEMA_SUCCESS = 'FETCH_SCHEMA_SUCCESS';
export const FETCH_SCHEMA_ERROR = 'FETCH_SCHEMA_ERROR';

export const DRAFTS_REQUEST = 'DRAFTS_REQUEST';
export const DRAFTS_SUCCESS = 'DRAFTS_SUCCESS';
export const DRAFTS_ERROR = 'DRAFTS_ERROR';

export const INIT_FORM = 'INIT_FORM';

export const INIT_DRAFT_REQUEST = 'INIT_DRAFT_REQUEST';
export const INIT_DRAFT_SUCCESS = 'INIT_DRAFT_SUCCESS';
export const INIT_DRAFT_ERROR = 'INIT_DRAFT_ERROR';

export const DRAFTS_ITEM_REQUEST = 'DRAFTS_ITEM_REQUEST';
export const DRAFTS_ITEM_SUCCESS = 'DRAFTS_ITEM_SUCCESS';
export const DRAFTS_ITEM_ERROR = 'DRAFTS_ITEM_ERROR';

export const PUBLISH_DRAFT_REQUEST = 'PUBLISH_DRAFT_REQUEST';
export const PUBLISH_DRAFT_SUCCESS = 'PUBLISH_DRAFT_SUCCESS';
export const PUBLISH_DRAFT_ERROR = 'PUBLISH_DRAFT_ERROR';

export const CREATE_DRAFT_REQUEST = 'CREATE_DRAFT_REQUEST';
export const CREATE_DRAFT_SUCCESS = 'CREATE_DRAFT_SUCCESS';
export const CREATE_DRAFT_ERROR = 'CREATE_DRAFT_ERROR';

export const DELETE_DRAFT_REQUEST = 'DELETE_DRAFT_REQUEST';
export const DELETE_DRAFT_SUCCESS = 'DELETE_DRAFT_SUCCESS';
export const DELETE_DRAFT_ERROR = 'DELETE_DRAFT_ERROR';

export const UPDATE_DRAFT_REQUEST = 'UPDATE_DRAFT_REQUEST';
export const UPDATE_DRAFT_SUCCESS = 'UPDATE_DRAFT_SUCCESS';
export const UPDATE_DRAFT_ERROR = 'UPDATE_DRAFT_ERROR';

export const DISCARD_DRAFT_REQUEST = 'DISCARD_DRAFT_REQUEST';
export const DISCARD_DRAFT_SUCCESS = 'DISCARD_DRAFT_SUCCESS';
export const DISCARD_DRAFT_ERROR = 'DISCARD_DRAFT_ERROR';

export const BUCKET_ITEM_REQUEST = 'BUCKET_ITEM_REQUEST';
export const BUCKET_ITEM_SUCCESS = 'BUCKET_ITEM_SUCCESS';
export const BUCKET_ITEM_ERROR = 'BUCKET_ITEM_ERROR';

export const UPLOAD_FILE_REQUEST = 'UPLOAD_FILE_REQUEST';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR';

export const EDIT_PUBLISHED_REQUEST = 'EDIT_PUBLISHED_REQUEST';
export const EDIT_PUBLISHED_SUCCESS = 'EDIT_PUBLISHED_SUCCESS';
export const EDIT_PUBLISHED_ERROR = 'EDIT_PUBLISHED_ERROR';


export const PERMISSIONS_ITEM_REQUEST = 'PERMISSIONS_ITEM_REQUEST';
export const PERMISSIONS_ITEM_SUCCESS = 'PERMISSIONS_ITEM_SUCCESS';
export const PERMISSIONS_ITEM_ERROR = 'PERMISSIONS_ITEM_ERROR';

export const USERS_ITEM_REQUEST = 'USERS_ITEM_REQUEST';
export const USERS_ITEM_SUCCESS = 'USERS_ITEM_SUCCESS';
export const USERS_ITEM_ERROR = 'USERS_ITEM_ERROR';

export const FORM_DATA_CHANGE = 'FORM_DATA_CHANGE';

export function draftsRequest(){ return { type: DRAFTS_REQUEST }; }
export function draftsSuccess(drafts) { return { type: DRAFTS_SUCCESS, drafts }; }
export function draftsError(error) { return { type: DRAFTS_ERROR, error }; }

export function initDraftRequest(){ return { type: INIT_DRAFT_REQUEST }; }
export function initDraftSuccess(draft_id, draft) { return { type: INIT_DRAFT_SUCCESS, draft_id, draft }; }
export function initDraftError(error) { return { type: INIT_DRAFT_ERROR, error }; }

export function draftsItemRequest(){ return { type: DRAFTS_ITEM_REQUEST }; }
export function draftsItemSuccess(draft_id, draft) { return { type: DRAFTS_ITEM_SUCCESS, draft_id, draft }; }
export function draftsItemError(error) { return { type: DRAFTS_ITEM_ERROR, error }; }

export function bucketItemRequest(){ return { type: BUCKET_ITEM_REQUEST }; }
export function bucketItemSuccess(bucket_id, bucket) { return { type: BUCKET_ITEM_SUCCESS, bucket_id, bucket }; }
export function bucketItemError(error) { return { type: BUCKET_ITEM_ERROR, error }; }

export function uploadFileRequest(filename){ return { type: UPLOAD_FILE_REQUEST, filename }; }
export function uploadFileSuccess(filename, data) { return { type: UPLOAD_FILE_SUCCESS, filename, data }; }
export function uploadFileError(filename, error) { return { type: UPLOAD_FILE_ERROR, filename, error }; }

export function publishDraftRequest() { return { type: PUBLISH_DRAFT_REQUEST }; }
export function publishDraftSuccess(published_id, published_record) { return { type: PUBLISH_DRAFT_SUCCESS, published_id, published_record }; }
export function publishDraftError(error) { return { type: PUBLISH_DRAFT_ERROR, error}; }

export function toggleFilemanagerLayer() { return { type: TOGGLE_FILEMANAGER_LAYER }; }

export function initForm() { return { type: INIT_FORM }; }

export function togglePreviewer() { return { type: TOGGLE_PREVIEWER }; }
export function toggleSidebar() { return { type: TOGGLE_SIDEBAR }; }
export function toggleLiveValidate() { return { type: TOGGLE_LIVE_VALIDATE }; }
export function toggleCustomValidation() { return { type: TOGGLE_CUSTOM_VALIDATION }; }
export function toggleValidate() { return { type: TOGGLE_VALIDATE }; }

export function formDataChange(data) {
  return {
    type: FORM_DATA_CHANGE,
    data
  }
};

export function fetchSchemaRequest() {
  return {
    type: FETCH_SCHEMA_REQUEST
  }
};

export function fetchSchemaSuccess (schema) {
  return {
    type: FETCH_SCHEMA_SUCCESS,
    schema
  }
};

export function fetchSchemaError(error) {
  type: FETCH_SCHEMA_ERROR,
  error
};

export function createDraftRequest() {
  return {
    type: CREATE_DRAFT_REQUEST
  }
};

export function createDraftSuccess(draft_id, draft) {
  return {
    type: CREATE_DRAFT_SUCCESS,
    draft_id,
    draft
  }
};

export function createDraftError(error) {
  return {
    type: CREATE_DRAFT_ERROR,
    error
  }
};

export function deleteDraftRequest() {
  return {
    type: DELETE_DRAFT_REQUEST
  }
};

export function deleteDraftSuccess() {
  return {
    type: DELETE_DRAFT_SUCCESS
  }
};

export function deleteDraftError(error) {
  return {
    type: DELETE_DRAFT_ERROR
  }
};

export function updateDraftRequest() {
  return {
    type: UPDATE_DRAFT_REQUEST
  }
}

export function updateDraftSuccess(draft_id, draft) {
  return {
    type: UPDATE_DRAFT_SUCCESS,
    draft_id,
    draft
  }
}

export function updateDraftError(error) {
  return {
    type: UPDATE_DRAFT_ERROR,
    error
    }
}

export function discardDraftRequest() {
  return {
    type: DISCARD_DRAFT_REQUEST
  }
}

export function discardDraftSuccess(draft_id, data) {
  return {
    type: DISCARD_DRAFT_SUCCESS,
    draft_id,
    data
  }
}

export function discardDraftError(error) {
  return {
    type: DISCARD_DRAFT_ERROR,
    error
  }
}

export function editPublishedRequest() {
  return {
    type: EDIT_PUBLISHED_REQUEST
  }
}

export function editPublishedSuccess(draft_id, draft) {
  return {
    type: EDIT_PUBLISHED_SUCCESS,
    draft_id,
    draft
  }
}

export function editPublishedError(error) {
  return {
    type: EDIT_PUBLISHED_ERROR,
    error
  }
}

export function permissionsItemRequest() {
  return {
    type: PERMISSIONS_ITEM_REQUEST
  }
}

export function permissionsItemSuccess(permissions) {
  return {
    type: PERMISSIONS_ITEM_SUCCESS,
    permissions
  }
}

export function permissionsItemError(error) {
  return {
    type: PERMISSIONS_ITEM_ERROR,
    error
  }
}

export function usersItemRequest() {
  return {
    type: USERS_ITEM_REQUEST
  }
}

export function usersItemSuccess(users) {
  return {
    type: USERS_ITEM_SUCCESS,
    users
  }
}

export function usersItemError(error) {
  return {
    type: USERS_ITEM_ERROR,
    error
  }
}

// [TOFIX] Plug validation action if needed.
export function validate(data, schema) {
  return dispatch => {
    dispatch(validateRequest());

    data['$ana_type'] = schema;

    axios.post('/api/deposit/validator', data)
      .then(function(response) {
        dispatch(validateSuccess(respose.data));
      })
      .catch(function(error) {
        dispatch(validateError());
      })
  };
}

// [TOFIX] : update the way to handle schemas
export function fetchSchema(schema) {
  return dispatch => {
    let schemaUrl = "/api/schemas/deposits/records/" + schema + "-v0.0.1.json";
    let uiSchemaUrl =  "/api/schemas/options/deposits/records/" + schema + "-v0.0.1.json";

    dispatch(fetchSchemaRequest());
    axios.get(schemaUrl)
      .then(function(response) {
          let schema = response.data;
          axios.get(uiSchemaUrl)
            .then(function(response) {
              let uiSchema = response.data;
              dispatch(fetchSchemaSuccess({schema:schema, uiSchema:uiSchema}));
            })
            .catch(function(error) {
              dispatch(fetchSchemaError());
            })
        })
      .catch(function(error) {
        dispatch(fetchSchemaError());
      })
  };
}


export function initDraft(schema, project_name) {
  return function (dispatch) {
    dispatch(createDraftRequest());
    let data = {
      "general_title": project_name,
      "$ana_type": schema,
      // "$schema": `https://analysispreservation.cern.ch/schemas/deposits/records/${schema}-v0.0.1.json`
    };

    axios.post('/api/deposits/', data)
      .then((response) => {
        const draft_id = response.data.links.self.split('/deposits/')[1];
        dispatch(initDraftSuccess(draft_id, response.data));
        dispatch(replace(`/drafts/${draft_id}`));
      })
      .catch((error) => dispatch(initDraftError(error)) )
  };
}

// [TOFIX] : Split create draft and combine it with initDraft
export function createDraft(data={}, schema) {
  return dispatch => {
    dispatch(createDraftRequest());

    let uri = '/api/deposits/';

    data['$ana_type'] = schema;

    axios.post(uri, data)
      .then((response) => {
        const draft_id = response.data.links.self.split('/deposits/')[1];
        dispatch(initDraftSuccess(draft_id, response.data));
        dispatch(replace(`/drafts/${draft_id}`));
        delete response.data.metadata['$ana_type'];
        axios.put(uri + draft_id, response.data.metadata)
          .then(function(response){
            dispatch(createDraftSuccess(draft_id, response.data));
          })
          .catch(function(error) {
            dispatch(createDraftError(error));
          });
      })
      .catch((error) => dispatch(initDraftError(error)) )
  };
}

export function editPublished(data={}, schema, draft_id) {
  return dispatch => {
    dispatch(editPublishedRequest());

    let uri = `/api/deposits/${draft_id}/actions/edit`;

    axios.post(uri)
      .then((response) => {
        data["$schema"] = schema;
        axios.put(`/api/deposits/${draft_id}`, data)
          .then(function(response){
            dispatch(editPublishedSuccess(draft_id, response.data));
          })
          .catch(function(error) {
            dispatch(editPublishedError(error));
          });
      })
      .catch((error) => dispatch(editPublishedError(error)) )
  };
}

export function updateDraft(data, draft_id, schema) {
  return dispatch => {
    dispatch(updateDraftRequest());

    let uri = `/api/deposits/${draft_id}`;
    data["$schema"] = schema;
    axios.put(uri, data)
      .then(function(response){
        dispatch(updateDraftSuccess(draft_id, response.data));
      })
      .catch(function(error) {
        dispatch(updateDraftError(error));
      });
  };
}

export function publishDraft(draft_id) {
  return dispatch => {
    dispatch(publishDraftRequest());

    let uri = `/api/deposits/${draft_id}/actions/publish`;

    axios.post(uri)
      .then(function(response){
        let pid =  response.data.metadata._deposit.pid.value;
        dispatch(publishDraftSuccess(pid, response.data));
        dispatch(replace(`/published/${pid}`));
      })
      .catch(function(error) {
        dispatch(publishDraftError(error));
      });
  };
}

export function deleteDraft(draft_id) {
  return dispatch => {
    dispatch(deleteDraftRequest());

    let uri = `/api/deposits/${draft_id}`;

    axios.delete(uri)
      .then(function(response){
        dispatch(deleteDraftSuccess());
        dispatch(replace('/drafts'));
      })
      .catch(function(error) {
        dispatch(deleteDraftError(error));
      });
  };
}

export function discardDraft(draft_id) {
  return dispatch => {
    dispatch(discardDraftRequest());

    let uri = `/api/deposits/${draft_id}/actions/discard`;

    axios.post(uri)
      .then(function(response){
        dispatch(discardDraftSuccess(draft_id, response.data));
      })
      .catch(function(error) {
        dispatch(discardDraftError(error));
      });
  };
}

export function getDraftById(draft_id, fetchSchemaFlag=false) {
  return function (dispatch) {
    dispatch(draftsItemRequest());

    let uri = `/api/deposits/${draft_id}`;
    axios.get(uri, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function (response) {
        let url;
        if (fetchSchemaFlag && response.data.metadata.$schema) {
          url = response.data.metadata.$schema;
          url = url.split('/')
          let schema = url[url.length-1].split("-v")[0];
          dispatch(fetchSchema(schema))
        }
        dispatch(draftsItemSuccess(draft_id, response.data));
      })
      .catch(function (error) {
        dispatch(draftsItemError(error));
      });
  };
}

export function getBucketById(bucket_id) {
  return function (dispatch) {
    dispatch(bucketItemRequest());

    let uri = `/api/files/${bucket_id}`;
    axios.get(uri)
      .then(function (response) {
        dispatch(bucketItemSuccess(bucket_id, response.data));
      })
      .catch(function (error) {
        dispatch(bucketItemError(error));
      });
  };
}

// Semi - working file upload
export function uploadFile(bucket_link, file) {
  return function (dispatch) {
    dispatch(uploadFileRequest(file.name));
    bucket_link = '/api/files/'+bucket_link.split('/files/')[1];
    let uri = `${bucket_link}/${file.name}`;

    let oReq = new XMLHttpRequest();
    oReq.open("PUT", uri, true);
    oReq.onload = function (oEvent) {
      try {
        let data = oEvent.target.response;
        data = JSON.parse(data)
        dispatch(uploadFileSuccess(file.name, data));
      }
      catch (err) {
        dispatch(uploadFileError(file.name, err.message));
      }
    };

    oReq.onreadystatechange = function() {//Call a function when the state changes.
        if(oReq.readyState == XMLHttpRequest.DONE && oReq.status == 200) {
            // Request finished. Do processing here.
        }
    }

    oReq.addEventListener('error', function(event) {
      dispatch(uploadFileError(file.name, {message: "Error in uploading"} ));
    });

    oReq.send(file);
  };
}

export function getPermissions(draft_id) {
  return function (dispatch) {
    dispatch(permissionsItemRequest);

    let uri = `/api/deposits/${draft_id}`;

    axios.get(uri)
      .then(function(response) {
        dispatch(permissionsItemSuccess(response.data.access));
      })
      .catch(function (error) {
        dispatch(permissionsItemError(error));
      });
  }
}

export function removePermissions(draft_id, email, action) {
  return function (dispatch) {
    dispatch(permissionsItemRequest);
    let data = _get_permissions_data(action, email, 'remove')
    let uri = `/api/deposits/${draft_id}/actions/permissions`;
    axios.post(uri, data)
      .then(function(response) {
        dispatch(permissionsItemSuccess(response.data.access));
      })
      .catch(function (error) {
        dispatch(permissionsItemError(error));
      });
  }
}

export function addPermissions(draft_id, email, action) {
  return function (dispatch) {
    dispatch(permissionsItemRequest);
    let data = _get_permissions_data(action, email, 'add')
    let uri = `/api/deposits/${draft_id}/actions/permissions`;
    axios.post(uri, data)
      .then(function(response) {
        dispatch(permissionsItemSuccess(response.data.access));
      })
      .catch(function (error) {
        dispatch(permissionsItemError(error));
      });
  }
}

function _get_permissions_data(action, email,  operation) {
  return {
      "permissions": [
          {
              "type": "user",
              "identity": `${email}`,
              "permissions": [{'action': `${action}`,
                                'op': `${operation}`}]
          }
      ]
  }
};


export function getUsers() {
  return function (dispatch) {
    dispatch(usersItemRequest);
    axios.get('/api/users')
    .then(function (response) {
      let users = response.data.hits.hits.map(item => ({email:item.email}));
      dispatch(usersItemSuccess(users));
    })
    .catch(function (error) {
      dispatch(usersItemError(error));
    });
  }
};




// export function uploadFile(bucket_link, file) {
//   return function (dispatch) {
//     dispatch(draftsItemRequest());
//     bucket_link = bucket_link.replace('http:', 'https:');
//     let uri = `${bucket_link}/${file.name}`;

//     const data = new FormData();
//     data.append('file', file);
//     data.append('name', 'myfile');

//     // uri = uri+'?uploads&size=8&partSize=4'
//     // axios.post(uri, data)
//     //   .then((response) => {
//     //     console.log("UPLOADED fiel::::::",response.data)
//     //   })
//     //   .catch((error) => {
//     //     console.log("UPLOADED error::::::",error)
//     //   })
//     axios.put(uri, data)
//       .then((response) => {
//         console.log("UPLOADED fiel::::::",response.data)
//       })
//       .catch((error) => {
//         console.log("UPLOADED error::::::",error)
//       })

//   };
// }