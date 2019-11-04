import axios from "axios";

export const TOGGLE_FILEMANAGER_LAYER = "TOGGLE_FILEMANAGER_LAYER";

export const BUCKET_ITEM_REQUEST = "BUCKET_ITEM_REQUEST";
export const BUCKET_ITEM_SUCCESS = "BUCKET_ITEM_SUCCESS";
export const BUCKET_ITEM_ERROR = "BUCKET_ITEM_ERROR";

export const UPLOAD_FILE_REQUEST = "UPLOAD_FILE_REQUEST";
export const UPLOAD_FILE_SUCCESS = "UPLOAD_FILE_SUCCESS";
export const UPLOAD_FILE_ERROR = "UPLOAD_FILE_ERROR";

export const DELETE_FILE_REQUEST = "DELETE_FILE_REQUEST";
export const DELETE_FILE_SUCCESS = "DELETE_FILE_SUCCESS";
export const DELETE_FILE_ERROR = "DELETE_FILE_ERROR";

// File Manager
export function toggleFilemanagerLayer(selectable = false, action = null) {
  return {
    type: TOGGLE_FILEMANAGER_LAYER,
    selectable,
    action
  };
}

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
export function uploadFileRequest(filename) {
  return { type: UPLOAD_FILE_REQUEST, filename };
}
export function uploadFileSuccess(filename, data) {
  return { type: UPLOAD_FILE_SUCCESS, filename, data };
}
export function uploadFileError(filename, error) {
  return { type: UPLOAD_FILE_ERROR, filename, error };
}
// Semi - working file upload
export function uploadFile(bucket_link, file) {
  return dispatch => {
    dispatch(uploadFileRequest(file.name));
    let bucket_id = bucket_link.split("/files/")[1];
    bucket_link = "/api/files/" + bucket_id;
    let uri = `${bucket_link}/${file.name}`;

    let oReq = new XMLHttpRequest();
    oReq.open("PUT", uri, true);
    oReq.onload = function(oEvent) {
      try {
        let data = oEvent.target.response;
        data = JSON.parse(data);
        dispatch(uploadFileSuccess(file.name, data));
      } catch (err) {
        dispatch(uploadFileError(file.name, err.message));
      }
    };

    oReq.onreadystatechange = function() {
      //Call a function when the state changes.
      if (oReq.readyState == XMLHttpRequest.DONE && oReq.status == 200) {
        // Request finished. Do processing here.
      }
    };

    oReq.addEventListener("error", function() {
      dispatch(uploadFileError(file.name, { message: "Error in uploading" }));
    });

    oReq.send(file);
  };
}
export function uploadViaUrl(
  draft_id,
  urlToGrab,
  type,
  download = true,
  connection = false
) {
  return dispatch => {
    let uri = `/api/deposits/${draft_id}/actions/upload`;
    let data = urlToGrab.map(url => {
      return {
        url: url,
        type: type,
        for_download: download,
        for_connection: connection
      };
    });

    // TOFIX !!!WARNING!!! Change this so as to send the data in one request.
    data.map(d => {
      let filename = d.url.split("/").pop();
      d.type == "repo" ? (filename = `${filename}.tar.gz`) : filename;
      dispatch(uploadFileRequest(filename)),
        axios
          .post(uri, d)
          .then(response => {
            dispatch(uploadFileSuccess(filename, response.data));
          })
          .catch(error => {
            dispatch(uploadFileError(d.url, error));
          });
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
