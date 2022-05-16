import axios from "axios";
import cogoToast from "cogo-toast";

export const TOGGLE_FILEMANAGER_LAYER = "TOGGLE_FILEMANAGER_LAYER";

export const BUCKET_ITEM_REQUEST = "BUCKET_ITEM_REQUEST";
export const BUCKET_ITEM_SUCCESS = "BUCKET_ITEM_SUCCESS";
export const BUCKET_ITEM_ERROR = "BUCKET_ITEM_ERROR";

export const PATH_SELECTED = "PATH_SELECTED";
export const UPLOAD_FILE_REQUEST = "UPLOAD_FILE_REQUEST";
export const UPLOAD_FILE_PROGRESS = "UPLOAD_FILE_PROGRESS";
export const UPLOAD_FILE_SUCCESS = "UPLOAD_FILE_SUCCESS";
export const UPLOAD_ACTION_SUCCESS = "UPLOAD_ACTION_SUCCESS";
export const UPLOAD_FILE_ERROR = "UPLOAD_FILE_ERROR";

export const CREATE_WEBHOOK_SUCCESS = "CREATE_WEBHOOK_SUCCESS";

export const DELETE_FILE_REQUEST = "DELETE_FILE_REQUEST";
export const DELETE_FILE_SUCCESS = "DELETE_FILE_SUCCESS";
export const DELETE_FILE_ERROR = "DELETE_FILE_ERROR";

export const FILE_VERSIONS_REQUEST = "FILE_VERSIONS_REQUEST";
export const FILE_VERSIONS_SUCCESS = "FILE_VERSIONS_SUCCESS";
export const FILE_VERSIONS_ERROR = "FILE_VERSIONS_ERROR";

// File Manager
export function toggleFilemanagerLayer(
  selectable = false,
  action = null,
  active = 0,
  message = null
) {
  return {
    type: TOGGLE_FILEMANAGER_LAYER,
    selectable,
    action,
    active,
    message
  };
}

export const fileVersionsRequest = () => ({
  type: FILE_VERSIONS_REQUEST
});

export const fileVersionsSuccess = files => ({
  type: FILE_VERSIONS_SUCCESS,
  payload: files
});

export const fileVersionsError = () => ({
  type: FILE_VERSIONS_ERROR
});

// Bucket
export function bucketItemRequest() {
  return { type: BUCKET_ITEM_REQUEST };
}
export function bucketItemSuccess(bucket) {
  return { type: BUCKET_ITEM_SUCCESS, bucket };
}
export function bucketItemError(error) {
  return { type: BUCKET_ITEM_ERROR, error };
}
export function getBucketById(bucket_id = null) {
  if (!bucket_id) return;
  return dispatch => {
    dispatch(bucketItemRequest());

    let uri = `/api/files/${bucket_id}`;
    axios
      .get(uri)
      .then(response => {
        dispatch(bucketItemSuccess(response.data));
      })
      .catch(error => {
        dispatch(bucketItemError(error.response));
      });
  };
}
export function getBucketByUri(uri = null) {
  if (!uri) return;
  return dispatch => {
    dispatch(bucketItemRequest());

    axios
      .get(uri)
      .then(response => {
        dispatch(bucketItemSuccess(response.data));
      })
      .catch(error => {
        dispatch(bucketItemError(error.response));
      });
  };
}

// File Item
export function selectPath(path, path_type) {
  return { type: PATH_SELECTED, path, path_type };
}
export function uploadFileRequest(filename) {
  return { type: UPLOAD_FILE_REQUEST, filename };
}
export function uploadFileProgress(filename, progress) {
  return { type: UPLOAD_FILE_PROGRESS, filename, progress };
}
export function uploadFileSuccess(filename, data) {
  return { type: UPLOAD_FILE_SUCCESS, filename, data };
}
export function uploadActionSuccess(filename) {
  return { type: UPLOAD_ACTION_SUCCESS, filename };
}
export function uploadFileError(filename, error) {
  return { type: UPLOAD_FILE_ERROR, filename, error };
}

export function createWebhookSuccess(repo) {
  return { type: CREATE_WEBHOOK_SUCCESS, repo };
}

// Semi - working file upload
export function uploadFile(bucket_link, file, filename, tags) {
  return dispatch => {
    let _filename = filename ? filename : file.name;
    dispatch(uploadFileRequest(_filename));
    let bucket_id = bucket_link.split("/files/")[1];
    bucket_link = "/api/files/" + bucket_id;
    let uri = `${bucket_link}/${_filename}`;

    let oReq = new XMLHttpRequest();
    oReq.open("PUT", uri, true);
    oReq.setRequestHeader('Content-Type', 'application/octet-stream');

    if (tags) oReq.setRequestHeader("X-CAP-File-Tags", tags);

    oReq.upload.addEventListener(
      "progress",
      function(evt) {
        if (evt.lengthComputable) {
          let percentComplete = evt.loaded / evt.total;
          dispatch(uploadFileProgress(_filename, percentComplete));
        }
      },
      false
    );

    oReq.onload = function(oEvent) {
      try {
        let data = oEvent.target.response;
        data = JSON.parse(data);
        dispatch(uploadFileSuccess(_filename, data));
      } catch (err) {
        dispatch(uploadFileError(_filename, err.message));
      }
    };

    oReq.onreadystatechange = function() {
      //Call a function when the state changes.
      if (oReq.readyState == XMLHttpRequest.DONE && oReq.status == 200) {
        // Request finished. Do processing here.
      }
    };

    oReq.addEventListener("error", function() {
      dispatch(uploadFileError(_filename, { message: "Error in uploading" }));
    });

    oReq.send(file);
  };
}

export function uploadViaUrl(draft_id, urlToGrab, type, download, webhook) {
  return dispatch => {
    let uri = `/api/deposits/${draft_id}/actions/upload`;
    let data = urlToGrab.map(url => {
      return {
        url: url,
        type: type,
        download: download,
        webhook: webhook
      };
    });

    // TOFIX !!!WARNING!!! Change this so as to send the data in one request.
    data.map(d => {
      let filename = d.url.split("/").pop();
      d.type == "repo" ? (filename = `${filename}.tar.gz`) : filename;
      dispatch(uploadFileRequest(filename));
      return axios
        .post(uri, d)
        .then(() => {
          return dispatch(uploadActionSuccess(filename));
        })
        .catch(error => {
          return dispatch(uploadFileError(d.url, error));
        });
    });
  };
}

export function uploadViaRepoUrl(
  draft_id,
  urlToGrab,
  webhook,
  event_type,
  repo_info = null
) {
  return dispatch => {
    let uri = `/api/deposits/${draft_id}/actions/upload`;
    let data = {
      url: urlToGrab,
      webhook,
      event_type
    };

    let filename = data.url.split("/").pop();
    data.type == "repo" ? (filename = `${filename}.tar.gz`) : filename;

    return axios
      .post(uri, data)
      .then(resp => {
        if (["push", "release"].indexOf(event_type) > -1) {
          try {
            dispatch(
              createWebhookSuccess({
                event_type,
                host: repo_info.resource,
                owner: repo_info.owner,
                name: repo_info.name,
                ref: repo_info.ref,
                snapshots: []
              })
            );
          } catch (err) {
            // eslint-disable-next-line no-empty
          }
        }
        return { filename, data: resp.data };
      })
      .catch(error => {
        throw { error };
      });
  };
}

export function deleteFileRequest(filename) {
  return { type: DELETE_FILE_REQUEST, filename };
}
export function deleteFileSuccess(filename) {
  return { type: DELETE_FILE_SUCCESS, filename };
}
export function deleteFileError(filename, error) {
  return { type: DELETE_FILE_ERROR, filename, error };
}
export function deleteFileByUri(file_uri = null, key = null) {
  if (!file_uri) return;
  return dispatch => {
    dispatch(deleteFileRequest(key));

    axios
      .delete(file_uri)
      .then(dispatch(deleteFileSuccess(key)))
      .catch(error => {
        cogoToast.error(error.response.data.message, {
          hideAfter: 3
        });
        dispatch(deleteFileError(key, error));
      });
  };
}
export function deleteFile(bucket, key) {
  return dispatch => {
    dispatch(deleteFileRequest(key));
    let uri = `/api/files/${bucket}/${key}`;
    axios
      .delete(uri)
      .then(dispatch(deleteFileSuccess(key)))
      .catch(error => {
        dispatch(deleteFileError(key, error));
      });
  };
}

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

export function getFileVersions() {
  return (dispatch, getState) => {
    // init request
    dispatch(fileVersionsRequest());

    let state = getState();

    let versions_link = state.draftItem
      .get("bucketFileLinks")
      .versions.split("/files/")[1];
    versions_link = "/api/files/" + versions_link;

    axios
      .get(versions_link)
      .then(response => {
        dispatch(fileVersionsSuccess(response.data.contents));
      })
      .catch(error => dispatch(fileVersionsError(error)));
  };
}
