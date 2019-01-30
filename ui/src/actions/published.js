import axios from "axios";
import { push } from "react-router-redux";
import { fetchAndAssignSchema } from "./common";

export const PUBLISHED_REQUEST = "PUBLISHED_REQUEST";
export const PUBLISHED_SUCCESS = "PUBLISHED_SUCCESS";
export const PUBLISHED_ERROR = "PUBLISHED_ERROR";

export const PUBLISHED_ITEM_REQUEST = "PUBLISHED_ITEM_REQUEST";
export const PUBLISHED_ITEM_SUCCESS = "PUBLISHED_ITEM_SUCCESS";
export const PUBLISHED_ITEM_ERROR = "PUBLISHED_ITEM_ERROR";

export const RERUN_STATUS_REQUEST = "RERUN_STATUS_REQUEST";
export const RERUN_STATUS_SUCCESS = "RERUN_STATUS_SUCCESS";
export const RERUN_STATUS_ERROR = "RERUN_STATUS_ERROR";

export const RERUN_GET_WORKFLOWS_REQUEST = "RERUN_GET_WORKFLOWS_REQUEST";
export const RERUN_GET_WORKFLOWS_SUCCESS = "RERUN_GET_WORKFLOWS_SUCCESS";
export const RERUN_GET_WORKFLOWS_ERROR = "RERUN_GET_WORKFLOWS_ERROR";

export const RERUN_CREATE_WORKFLOW_REQUEST = "RERUN_CREATE_WORKFLOW_REQUEST";
export const RERUN_CREATE_WORKFLOW_SUCCESS = "RERUN_CREATE_WORKFLOW_SUCCESS";
export const RERUN_CREATE_WORKFLOW_ERROR = "RERUN_CREATE_WORKFLOW_ERROR";

export const RERUN_START_WORKFLOW_REQUEST = "RERUN_START_WORKFLOW_REQUEST";
export const RERUN_START_WORKFLOW_SUCCESS = "RERUN_START_WORKFLOW_SUCCESS";
export const RERUN_START_WORKFLOW_ERROR = "RERUN_START_WORKFLOW_ERROR";

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

export function rerunCreateWorkflowRequest() {
  return {
    type: RERUN_CREATE_WORKFLOW_REQUEST
  };
}

export function rerunCreateWorkflowSuccess(data) {
  return {
    type: RERUN_CREATE_WORKFLOW_SUCCESS,
    data
  };
}

export function rerunCreateWorkflowError(error) {
  return {
    type: RERUN_CREATE_WORKFLOW_ERROR,
    error
  };
}

export function rerunStartWorkflowRequest() {
  return {
    type: RERUN_START_WORKFLOW_REQUEST
  };
}

export function rerunStartWorkflowSuccess(data) {
  return {
    type: RERUN_START_WORKFLOW_SUCCESS,
    data
  };
}

export function rerunStartWorkflowError(error) {
  return {
    type: RERUN_START_WORKFLOW_ERROR,
    error
  };
}

export function rerunGetWorkflowsRequest() {
  return {
    type: RERUN_GET_WORKFLOWS_REQUEST
  };
}

export function rerunGetWorkflowsSuccess(data) {
  return {
    type: RERUN_GET_WORKFLOWS_SUCCESS,
    data
  };
}

export function rerunGetWorkflowsError(error) {
  return {
    type: RERUN_GET_WORKFLOWS_ERROR,
    error
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

export function rerunCreateWorkflow(workflow, published_id) {
  return dispatch => {
    dispatch(rerunCreateWorkflowRequest());
    let uri = "/api/reana/create";

    axios
      .post(uri, {
        workflow_json: workflow.workflow,
        workflow_name: workflow.workflow_title,
        record_id: published_id
      })
      .then(response => {
        dispatch(rerunCreateWorkflowSuccess(response.data));
        let { workflow_id } = response.data;
        dispatch(rerunStartWorkflow(workflow_id));
        dispatch(push(`/published/${published_id}/runs`));
      })
      .catch(error => {
        dispatch(rerunCreateWorkflowError(error));
      });
  };
}

export function rerunStartWorkflow(workflow_id) {
  return dispatch => {
    dispatch(rerunStartWorkflowRequest());
    let uri = `/api/reana/start/${workflow_id}`;

    axios
      .get(uri)
      .then(response => {
        dispatch(rerunStartWorkflowSuccess(response.data));
      })
      .catch(error => {
        dispatch(rerunStartWorkflowError(error));
      });
  };
}

export function rerunGetWorkflows(published_id) {
  return dispatch => {
    dispatch(rerunGetWorkflowsRequest());
    let uri = `/api/reana/jobs/${published_id}`;

    axios
      .get(uri)
      .then(response => {
        let _jobs = {};
        response.data.map(job => (_jobs[job.params.reana_id] = job));
        dispatch(rerunGetWorkflowsSuccess(_jobs));
      })
      .catch(error => {
        dispatch(rerunGetWorkflowsError(error));
      });
  };
}

// export function rerunWorkflowStatus(workflow_id) {
//   return dispatch => {
//     dispatch(rerunStatusRequest());

//     let uri = `/api/reana/status/${workflow_id}`;

//     axios
//       .get(uri)
//       .then(response => {
//         dispatch(rerunStatusSuccess(workflow_id, response.data));
//       })
//       .catch(error => {
//         dispatch(rerunStatusError(error));
//       });
//   };
// }
