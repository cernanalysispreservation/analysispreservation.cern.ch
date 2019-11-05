import axios from "axios";
import { push } from "react-router-redux";

const WORKFLOWS_API_URL = "/api/workflows";
const REANA_WORKFLOWS_API_URL = `${WORKFLOWS_API_URL}/reana`;

const WORKFLOWS_FOR_RECORD = pid => `${WORKFLOWS_API_URL}/all/record/${pid}`;
const REANA_WORKFLOWS_PING = `${REANA_WORKFLOWS_API_URL}/ping`;
const REANA_WORKFLOWS_CREATE_URL = `${REANA_WORKFLOWS_API_URL}`;
const REANA_WORKFLOWS_ITEM_URL = workflow_id =>
  `${escape(REANA_WORKFLOWS_API_URL)}/${workflow_id}`;
const REANA_WORKFLOWS_ITEM_FILES_URL = workflow_id =>
  `${REANA_WORKFLOWS_ITEM_URL(workflow_id)}/files`;
// const REANA_WORKFLOWS_ITEM_LOGS_URL = workflow_id =>
//   `${REANA_WORKFLOWS_ITEM_URL(workflow_id)}/logs`;
const REANA_WORKFLOWS_ITEM_START_URL = workflow_id =>
  `${REANA_WORKFLOWS_ITEM_URL(workflow_id)}/start`;
const REANA_WORKFLOWS_ITEM_STOP_URL = workflow_id =>
  `${REANA_WORKFLOWS_ITEM_URL(workflow_id)}/stop`;
const REANA_WORKFLOWS_ITEM_STATUS_URL = workflow_id =>
  `${REANA_WORKFLOWS_ITEM_URL(workflow_id)}/status`;
// const REANA_WORKFLOWS_ITEM_CLONE_URL = workflow_id =>
//   `${REANA_WORKFLOWS_ITEM_URL(workflow_id)}/clone`;
// const REANA_WORKFLOWS_ITEM_DOWNLOAD_URL = (workflow_id, path) =>
//   `${REANA_WORKFLOWS_ITEM_FILES_URL(workflow_id)}/${path}`;
const REANA_WORKFLOWS_ITEM_UPLOAD_URL = workflow_id =>
  `${REANA_WORKFLOWS_ITEM_FILES_URL(workflow_id)}/upload`;

export const WORKFLOWS_REQUEST = "WORKFLOWS_REQUEST";
export const WORKFLOWS_SUCCESS = "WORKFLOWS_SUCCESS";
export const WORKFLOWS_ERROR = "WORKFLOWS_ERROR";

export const WORKFLOWS_RECORD_REQUEST = "WORKFLOWS_RECORD_REQUEST";
export const WORKFLOWS_RECORD_SUCCESS = "WORKFLOWS_RECORD_SUCCESS";
export const WORKFLOWS_RECORD_ERROR = "WORKFLOWS_RECORD_ERROR";

export const WORKFLOW_REQUEST = "WORKFLOW_REQUEST";
export const WORKFLOW_SUCCESS = "WORKFLOW_SUCCESS";
export const WORKFLOW_ERROR = "WORKFLOW_ERROR";

export const RECORD_WORKFLOW_REQUEST = "RECORD_WORKFLOW_REQUEST";
export const RECORD_WORKFLOW_SUCCESS = "RECORD_WORKFLOW_SUCCESS";
export const RECORD_WORKFLOW_ERROR = "RECORD_WORKFLOW_ERROR";

export const WORKFLOW_CREATE_REQUEST = "WORKFLOW_CREATE_REQUEST";
export const WORKFLOW_CREATE_SUCCESS = "WORKFLOW_CREATE_SUCCESS";
export const WORKFLOW_CREATE_ERROR = "WORKFLOW_CREATE_ERROR";

export const WORKFLOW_DELETE_REQUEST = "WORKFLOW_DELETE_REQUEST";
export const WORKFLOW_DELETE_SUCCESS = "WORKFLOW_DELETE_SUCCESS";
export const WORKFLOW_DELETE_ERROR = "WORKFLOW_DELETE_ERROR";

export const WORKFLOW_START_REQUEST = "WORKFLOW_START_REQUEST";
export const WORKFLOW_START_SUCCESS = "WORKFLOW_START_SUCCESS";
export const WORKFLOW_START_ERROR = "WORKFLOW_START_ERROR";

export const WORKFLOW_STOP_REQUEST = "WORKFLOW_STOP_REQUEST";
export const WORKFLOW_STOP_SUCCESS = "WORKFLOW_STOP_SUCCESS";
export const WORKFLOW_STOP_ERROR = "WORKFLOW_STOP_ERROR";

export const WORKFLOW_CLONE_REQUEST = "WORKFLOW_CLONE_REQUEST";
export const WORKFLOW_CLONE_SUCCESS = "WORKFLOW_CLONE_SUCCESS";
export const WORKFLOW_CLONE_ERROR = "WORKFLOW_CLONE_ERROR";

export const WORKFLOW_STATUS_REQUEST = "WORKFLOW_STATUS_REQUEST";
export const WORKFLOW_STATUS_SUCCESS = "WORKFLOW_STATUS_SUCCESS";
export const WORKFLOW_STATUS_ERROR = "WORKFLOW_STATUS_ERROR";

export const WORKFLOW_LOGS_REQUEST = "WORKFLOW_LOGS_REQUEST";
export const WORKFLOW_LOGS_SUCCESS = "WORKFLOW_LOGS_SUCCESS";
export const WORKFLOW_LOGS_ERROR = "WORKFLOW_LOGS_ERROR";

export const WORKFLOW_FILES_REQUEST = "WORKFLOW_FILES_REQUEST";
export const WORKFLOW_FILES_SUCCESS = "WORKFLOW_FILES_SUCCESS";
export const WORKFLOW_FILES_ERROR = "WORKFLOW_FILES_ERROR";

export const WORKFLOW_FILE_UPLOAD_REQUEST = "WORKFLOW_FILE_UPLOAD_REQUEST";
export const WORKFLOW_FILE_UPLOAD_SUCCESS = "WORKFLOW_FILE_UPLOAD_SUCCESS";
export const WORKFLOW_FILE_UPLOAD_ERROR = "WORKFLOW_FILE_UPLOAD_ERROR";

export const WORKFLOW_FILE_DELETE_REQUEST = "WORKFLOW_FILE_DELETE_REQUEST";
export const WORKFLOW_FILE_DELETE_SUCCESS = "WORKFLOW_FILE_DELETE_SUCCESS";
export const WORKFLOW_FILE_DELETE_ERROR = "WORKFLOW_FILE_DELETE_ERROR";

export const workflowsRequest = () => ({ type: WORKFLOWS_REQUEST });
export const workflowsSuccess = workflows => ({
  type: WORKFLOWS_SUCCESS,
  workflows
});
export const workflowsError = error => ({ type: WORKFLOWS_ERROR, error });

export const workflowsRecordRequest = () => ({
  type: WORKFLOWS_RECORD_REQUEST
});
export const workflowsRecordSuccess = (record_id, workflows) => ({
  type: WORKFLOWS_RECORD_SUCCESS,
  record_id,
  workflows
});
export const workflowsRecordError = error => ({
  type: WORKFLOWS_RECORD_ERROR,
  error
});

export const workflowStatusRequest = workflow_id => ({
  type: WORKFLOW_STATUS_REQUEST,
  workflow_id
});
export const workflowStatusSuccess = (data, workflow_id) => ({
  type: WORKFLOW_STATUS_SUCCESS,
  workflow_id,
  data
});
export const workflowStatusError = error => ({
  type: WORKFLOW_STATUS_ERROR,
  error
});

export const workflowLogsRequest = workflow_id => ({
  type: WORKFLOW_LOGS_REQUEST,
  workflow_id
});
export const workflowLogsSuccess = (data, workflow_id) => ({
  type: WORKFLOW_LOGS_SUCCESS,
  workflow_id,
  data
});
export const workflowLogsError = error => ({
  type: WORKFLOW_LOGS_ERROR,
  error
});

export const workflowRequest = workflow_id => ({
  type: WORKFLOW_REQUEST,
  workflow_id
});
export const workflowSuccess = (data, workflow_id) => ({
  type: WORKFLOW_SUCCESS,
  data,
  workflow_id
});
export const workflowError = (error, workflow_id) => ({
  type: WORKFLOW_ERROR,
  error,
  workflow_id
});
export const recordWorkflowRequest = workflow_id => ({
  type: RECORD_WORKFLOW_REQUEST,
  workflow_id
});
export const recordWorkflowSuccess = (data, workflow_id) => ({
  type: RECORD_WORKFLOW_SUCCESS,
  data,
  workflow_id
});
export const recordWorkflowError = (error, workflow_id) => ({
  type: RECORD_WORKFLOW_ERROR,
  error,
  workflow_id
});

export const createWorkflowRequest = workflow_id => ({
  type: WORKFLOW_CREATE_REQUEST,
  workflow_id
});
export const createWorkflowSuccess = (data, workflow_id) => ({
  type: WORKFLOW_CREATE_SUCCESS,
  data,
  workflow_id
});
export const createWorkflowError = (error, workflow_id) => ({
  type: WORKFLOW_CREATE_ERROR,
  error,
  workflow_id
});

export const startWorkflowRequest = workflow_id => ({
  type: WORKFLOW_START_REQUEST,
  workflow_id
});
export const startWorkflowSuccess = (data, workflow_id) => ({
  type: WORKFLOW_START_SUCCESS,
  data,
  workflow_id
});
export const startWorkflowError = (error, workflow_id) => ({
  type: WORKFLOW_START_ERROR,
  error,
  workflow_id
});

export const stopWorkflowRequest = workflow_id => ({
  type: WORKFLOW_STOP_REQUEST,
  workflow_id
});
export const stopWorkflowSuccess = (data, workflow_id) => ({
  type: WORKFLOW_STOP_SUCCESS,
  data,
  workflow_id
});
export const stopWorkflowError = (error, workflow_id) => ({
  type: WORKFLOW_STOP_ERROR,
  error,
  workflow_id
});

export const workflowFilesRequest = workflow_id => ({
  type: WORKFLOW_FILES_REQUEST,
  workflow_id
});
export const workflowFilesSuccess = (data, workflow_id) => ({
  type: WORKFLOW_FILES_SUCCESS,
  data,
  workflow_id
});
export const workflowFilesError = (error, workflow_id) => ({
  type: WORKFLOW_FILES_ERROR,
  error,
  workflow_id
});

export const workflowFileUploadRequest = workflow_id => ({
  type: WORKFLOW_FILE_UPLOAD_REQUEST,
  workflow_id
});
export const workflowFileUploadSuccess = (data, workflow_id) => ({
  type: WORKFLOW_FILE_UPLOAD_SUCCESS,
  data,
  workflow_id
});
export const workflowFileUploadError = (error, workflow_id) => ({
  type: WORKFLOW_FILE_UPLOAD_ERROR,
  error,
  workflow_id
});

export function reanaPing() {
  return dispatch => {
    axios
      .get(REANA_WORKFLOWS_PING)
      .then(response => dispatch(startWorkflowSuccess(response.data)))
      .catch(error => dispatch(startWorkflowError(error)));
  };
}

// List Workflows
export function getWorkflows() {
  return dispatch => {
    dispatch(workflowsRequest());

    axios
      .get(WORKFLOWS_API_URL)
      .then(response => dispatch(workflowsSuccess(response.data)))
      .catch(error => dispatch(workflowsError(error)));
  };
}
export function getRecordWorkflows(pid) {
  return dispatch => {
    dispatch(workflowsRecordRequest());

    axios
      .get(WORKFLOWS_FOR_RECORD(pid))
      .then(response => dispatch(workflowsRecordSuccess(pid, response.data)))
      .catch(error => dispatch(workflowsRecordError(error)));
  };
}

// Create Workflow

// Workflow Item
export function getWorkflow(workflow_id) {
  return dispatch => {
    dispatch(workflowRequest(workflow_id));

    axios
      .get(REANA_WORKFLOWS_ITEM_URL(workflow_id))
      .then(response => dispatch(workflowSuccess(response.data, workflow_id)))
      .catch(error => dispatch(workflowError(error, workflow_id)));
  };
}

export function getRecordWorkflow(workflow_id) {
  return dispatch => {
    dispatch(recordWorkflowRequest(workflow_id));

    axios
      .get(REANA_WORKFLOWS_ITEM_URL(workflow_id))
      .then(response =>
        dispatch(recordWorkflowSuccess(response.data, workflow_id))
      )
      .catch(error => dispatch(recordWorkflowError(error, workflow_id)));
  };
}
export function createWorkflow(workflow, autostart = false) {
  return dispatch => {
    dispatch(createWorkflowRequest());

    axios
      .post(
        REANA_WORKFLOWS_CREATE_URL, // workflow
        {
          workflow_json: workflow.workflow_json,
          workflow_name: workflow.name,
          pid: workflow.pid
        }
      )
      .then(response => {
        let { workflow_id } = response.data;
        dispatch(createWorkflowSuccess(response.data));
        dispatch(push(`/drafts/${workflow.pid}/workflows/${workflow_id}`));
        if (autostart) {
          dispatch(startWorkflow(workflow_id));
        }
      })
      .catch(error => dispatch(createWorkflowError(error)));
  };
}
export function deleteWorkflow(workflow_id) {
  return dispatch => {
    dispatch(startWorkflowRequest(workflow_id));

    axios
      .get(REANA_WORKFLOWS_ITEM_START_URL(workflow_id))
      .then(response =>
        dispatch(startWorkflowSuccess(response.data, workflow_id))
      )
      .catch(error => dispatch(startWorkflowError(error, workflow_id)));
  };
}
export function startWorkflow(workflow_id) {
  return dispatch => {
    dispatch(startWorkflowRequest(workflow_id));

    axios
      .post(REANA_WORKFLOWS_ITEM_START_URL(workflow_id))
      .then(response =>
        dispatch(startWorkflowSuccess(response.data, workflow_id))
      )
      .catch(error => dispatch(startWorkflowError(error, workflow_id)));
  };
}
export function stopWorkflow(workflow_id) {
  return dispatch => {
    dispatch(stopWorkflowRequest(workflow_id));

    axios
      .get(REANA_WORKFLOWS_ITEM_STOP_URL(workflow_id))
      .then(response =>
        dispatch(stopWorkflowSuccess(response.data, workflow_id))
      )
      .catch(error => dispatch(stopWorkflowError(error, workflow_id)));
  };
}
export function getWorkflowStatus(workflow_id) {
  return dispatch => {
    dispatch(workflowStatusRequest(workflow_id));

    axios
      .get(REANA_WORKFLOWS_ITEM_STATUS_URL(workflow_id))
      .then(response =>
        dispatch(workflowStatusSuccess(response.data, workflow_id))
      )
      .catch(error => dispatch(workflowStatusError(error, workflow_id)));
  };
}
export function getWorkflowLogs(workflow_id) {
  return dispatch => {
    dispatch(workflowLogsRequest(workflow_id));

    axios
      .get(REANA_WORKFLOWS_ITEM_STATUS_URL(workflow_id))
      .then(response =>
        dispatch(workflowLogsSuccess(response.data, workflow_id))
      )
      .catch(error => dispatch(workflowLogsError(error, workflow_id)));
  };
}
export function getWorkflowFiles(workflow_id) {
  return dispatch => {
    dispatch(workflowFilesRequest(workflow_id));

    axios
      .get(REANA_WORKFLOWS_ITEM_FILES_URL(workflow_id))
      .then(response =>
        dispatch(workflowFilesSuccess(response.data, workflow_id))
      )
      .catch(error => dispatch(workflowFilesError(error, workflow_id)));
  };
}
export function uploadWorkflowFiles(workflow_id, data) {
  return dispatch => {
    dispatch(workflowFilesRequest(workflow_id));

    let _data = {
      files_to_upload: [data]
    };

    axios
      .post(REANA_WORKFLOWS_ITEM_UPLOAD_URL(workflow_id), _data)
      .then(response =>
        dispatch(workflowFilesSuccess(response.data, workflow_id))
      )
      .catch(error => dispatch(workflowFilesError(error, workflow_id)));
  };
}
