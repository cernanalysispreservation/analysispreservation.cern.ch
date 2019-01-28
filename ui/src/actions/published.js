import axios from "axios";
import { replace, push } from "react-router-redux";
import { fetchAndAssignSchema } from "./common";

export const PUBLISHED_REQUEST = "PUBLISHED_REQUEST";
export const PUBLISHED_SUCCESS = "PUBLISHED_SUCCESS";
export const PUBLISHED_ERROR = "PUBLISHED_ERROR";

export const PUBLISHED_ITEM_REQUEST = "PUBLISHED_ITEM_REQUEST";
export const PUBLISHED_ITEM_SUCCESS = "PUBLISHED_ITEM_SUCCESS";
export const PUBLISHED_ITEM_ERROR = "PUBLISHED_ITEM_ERROR";

export const RERUN_PUBLISHED_REQUEST = "RERUN_PUBLISHED_REQUEST";
export const RERUN_PUBLISHED_SUCCESS = "RERUN_PUBLISHED_SUCCESS";
export const RERUN_PUBLISHED_ERROR = "RERUN_PUBLISHED_ERROR";

export const RERUN_STATUS_REQUEST = "RERUN_STATUS_REQUEST";
export const RERUN_STATUS_SUCCESS = "RERUN_STATUS_SUCCESS";
export const RERUN_STATUS_ERROR = "RERUN_STATUS_ERROR";

export const RERUN_OUTPUTS_REQUEST = "RERUN_OUTPUTS_REQUEST";
export const RERUN_OUTPUTS_SUCCESS = "RERUN_OUTPUTS_SUCCESS";
export const RERUN_OUTPUTS_ERROR = "RERUN_OUTPUTS_ERROR";

export const REANA_GET_WORKFLOWS_REQUEST = "REANA_GET_WORKFLOWS_REQUEST";
export const REANA_GET_WORKFLOWS_SUCCESS = "REANA_GET_WORKFLOWS_SUCCESS";
export const REANA_GET_WORKFLOWS_ERROR = "REANA_GET_WORKFLOWS_ERROR";

export const REANA_CREATE_WORKFLOW_REQUEST = "REANA_CREATE_WORKFLOW_REQUEST";
export const REANA_CREATE_WORKFLOW_SUCCESS = "REANA_CREATE_WORKFLOW_SUCCESS";
export const REANA_CREATE_WORKFLOW_ERROR = "REANA_CREATE_WORKFLOW_ERROR";

export const REANA_START_WORKFLOW_REQUEST = "REANA_START_WORKFLOW_REQUEST";
export const REANA_START_WORKFLOW_SUCCESS = "REANA_START_WORKFLOW_SUCCESS";
export const REANA_START_WORKFLOW_ERROR = "REANA_START_WORKFLOW_ERROR";

export function publishedRequest() {
  return {
    type: PUBLISHED_REQUEST
  };
}

export function publishedSuccess(published) {
  return {
    type: PUBLISHED_SUCCESS,
    published
  };
}

export function publishedError(error) {
  return {
    type: PUBLISHED_ERROR,
    error
  };
}

export function publishedItemRequest() {
  return {
    type: PUBLISHED_ITEM_REQUEST
  };
}

export function publishedItemSuccess(published) {
  return {
    type: PUBLISHED_ITEM_SUCCESS,
    published
  };
}

export function publishedItemError(error) {
  return {
    type: PUBLISHED_ITEM_ERROR,
    error
  };
}

export function rerunPublishedRequest() {
  return {
    type: RERUN_PUBLISHED_REQUEST
  };
}

export function rerunPublishedSuccess(data) {
  return {
    type: RERUN_PUBLISHED_SUCCESS,
    data
  };
}

export function rerunPublishedError(error) {
  return {
    type: RERUN_PUBLISHED_ERROR,
    error
  };
}

export function rerunStatusRequest() {
  return {
    type: RERUN_STATUS_REQUEST
  };
}

export function rerunStatusSuccess(workflow_id, data) {
  return {
    type: RERUN_STATUS_SUCCESS,
    workflow_id,
    data
  };
}

export function rerunStatusError(error) {
  return {
    type: RERUN_STATUS_ERROR,
    error
  };
}

export function rerunOutputsRequest() {
  return {
    type: RERUN_OUTPUTS_REQUEST
  };
}

export function rerunOutputsSuccess(data) {
  return {
    type: RERUN_OUTPUTS_SUCCESS,
    data
  };
}

export function rerunOutputsError(error) {
  return {
    type: RERUN_OUTPUTS_ERROR,
    error
  };
}

export function REANACreateWorkflowRequest() {
  return {
    type: REANA_CREATE_WORKFLOW_REQUEST
  };
}

export function REANACreateWorkflowSuccess(data) {
  return {
    type: REANA_CREATE_WORKFLOW_SUCCESS,
    data
  };
}

export function REANACreateWorkflowError(error) {
  return {
    type: REANA_CREATE_WORKFLOW_ERROR,
    error
  };
}

export function REANAStartWorkflowRequest() {
  return {
    type: REANA_START_WORKFLOW_REQUEST
  };
}

export function REANAStartWorkflowSuccess(data) {
  return {
    type: REANA_START_WORKFLOW_SUCCESS,
    data
  };
}

export function REANAStartWorkflowError(error) {
  return {
    type: REANA_START_WORKFLOW_ERROR,
    error
  };
}

export function REANAGetWorkflowsRequest() {
  return {
    type: REANA_GET_WORKFLOWS_REQUEST
  };
}

export function REANAGetWorkflowsSuccess(data) {
  return {
    type: REANA_GET_WORKFLOWS_SUCCESS,
    data
  };
}

export function REANAGetWorkflowsError(error) {
  return {
    type: REANA_GET_WORKFLOWS_ERROR,
    error
  };
}

export function REANACreateWorkflow(workflow, published_id, autostart = false) {
  return (dispatch, getState, history) => {
    dispatch(REANACreateWorkflowRequest());
    let uri = "/api/reana/create";

    axios
      .post(uri, {
        workflow_json: workflow.workflow,
        workflow_name: workflow.workflow_title,
        record_id: published_id
      })
      .then(response => {
        dispatch(REANACreateWorkflowSuccess(response.data));
        let { workflow_id } = response.data;
        dispatch(REANAStartWorkflow(workflow_id));
        dispatch(push(`/published/${published_id}/runs`));
      })
      .catch(error => {
        dispatch(REANACreateWorkflowError(error));
      });
  };
}

export function REANAStartWorkflow(workflow_id) {
  return (dispatch, getState) => {
    dispatch(REANAStartWorkflowRequest());
    let uri = `/api/reana/start/${workflow_id}`;

    axios
      .get(uri)
      .then(response => {
        dispatch(REANAStartWorkflowSuccess(response.data));
      })
      .catch(error => {
        dispatch(REANAStartWorkflowError(error));
      });
  };
}

export function REANAWorkflowsGet(published_id) {
  return (dispatch, getState, history) => {
    dispatch(REANAGetWorkflowsRequest());
    let uri = `/api/reana/jobs/${published_id}`;

    axios
      .get(uri)
      .then(response => {
        let _jobs = {};
        response.data.map(job => (_jobs[job.params.reana_id] = job));
        dispatch(REANAGetWorkflowsSuccess(_jobs));
        // dispatch(push(`/published/${published_id}/runs`));
      })
      .catch(error => {
        dispatch(REANAGetWorkflowsError(error));
      });
  };
}

export function getPublished() {
  return dispatch => {
    dispatch(publishedRequest());

    let uri = "/api/records/";
    axios
      .get(uri)
      .then(response => {
        dispatch(publishedSuccess(response.data));
      })
      .catch(error => {
        dispatch(publishedError(error));
      });
  };
}

export function getPublishedItem(id) {
  return dispatch => {
    dispatch(publishedItemRequest());

    let uri = `/api/records/${id}`;
    axios
      .get(uri)
      .then(response => {
        dispatch(fetchAndAssignSchema(response.data.metadata.$schema));
        dispatch(publishedItemSuccess(response.data));
      })
      .catch(error => {
        dispatch(publishedItemError(error.response.data));
      });
  };
}

export function rerunPublished(workflow_id, pid) {
  return dispatch => {
    dispatch(rerunPublishedRequest());

    let uri = `/api/reana/start/${workflow_id}`;

    axios
      .get(uri)
      .then(response => {
        dispatch(rerunPublishedSuccess(response.data));
        dispatch(replace(`/published/${pid}/status/${workflow_id}`));
      })
      .catch(error => {
        dispatch(rerunPublishedSuccess(error));
      });
  };
}

export function REANAWorkflowStatus(workflow_id) {
  return dispatch => {
    dispatch(rerunStatusRequest());

    let uri = `/api/reana/status/${workflow_id}`;

    axios
      .get(uri)
      .then(response => {
        dispatch(rerunStatusSuccess(workflow_id, response.data));
      })
      .catch(error => {
        dispatch(rerunStatusError(error));
      });
  };
}

export function getAnalysisOutputs(workflow_id) {
  return dispatch => {
    dispatch(rerunOutputsRequest());

    let uri = `/api/reana/status/${workflow_id}/outputs`;

    axios
      .get(uri)
      .then(response => {
        dispatch(rerunOutputsSuccess(response.data));
      })
      .catch(error => {
        dispatch(rerunOutputsError(error));
      });
  };
}
