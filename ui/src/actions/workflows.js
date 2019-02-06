import axios from "axios";
import { push } from "react-router-redux";

// export const WORKFLOW_STATUS_REQUEST = "WORKFLOW_STATUS_REQUEST";
// export const WORKFLOW_STATUS_SUCCESS = "WORKFLOW_STATUS_SUCCESS";
// export const WORKFLOW_STATUS_ERROR = "WORKFLOW_STATUS_ERROR";

export const GET_WORKFLOWS_REQUEST = "GET_WORKFLOWS_REQUEST";
export const GET_WORKFLOWS_SUCCESS = "GET_WORKFLOWS_SUCCESS";
export const GET_WORKFLOWS_ERROR = "GET_WORKFLOWS_ERROR";

export const CREATE_WORKFLOW_REQUEST = "CREATE_WORKFLOW_REQUEST";
export const CREATE_WORKFLOW_SUCCESS = "CREATE_WORKFLOW_SUCCESS";
export const CREATE_WORKFLOW_ERROR = "CREATE_WORKFLOW_ERROR";

export const START_WORKFLOW_REQUEST = "START_WORKFLOW_REQUEST";
export const START_WORKFLOW_SUCCESS = "START_WORKFLOW_SUCCESS";
export const START_WORKFLOW_ERROR = "START_WORKFLOW_ERROR";

// export function workflowStatusRequest() {
//   return {
//     type: WORKFLOW_STATUS_REQUEST
//   };
// }

// export function workflowStatusSuccess(workflow_id, data) {
//   return {
//     type: WORKFLOW_STATUS_SUCCESS,
//     workflow_id,
//     data
//   };
// }

// export function workflowStatusError(error) {
//   return {
//     type: WORKFLOW_STATUS_ERROR,
//     error
//   };
// }

export function createWorkflowRequest() {
  return {
    type: CREATE_WORKFLOW_REQUEST
  };
}

export function createWorkflowSuccess(data) {
  return {
    type: CREATE_WORKFLOW_SUCCESS,
    data
  };
}

export function createWorkflowError(error) {
  return {
    type: CREATE_WORKFLOW_ERROR,
    error
  };
}

export function startWorkflowRequest() {
  return {
    type: START_WORKFLOW_REQUEST
  };
}

export function startWorkflowSuccess(data) {
  return {
    type: START_WORKFLOW_SUCCESS,
    data
  };
}

export function startWorkflowError(error) {
  return {
    type: START_WORKFLOW_ERROR,
    error
  };
}

export function getWorkflowsRequest() {
  return {
    type: GET_WORKFLOWS_REQUEST
  };
}

export function getWorkflowsSuccess(data) {
  return {
    type: GET_WORKFLOWS_SUCCESS,
    data
  };
}

export function getWorkflowsError(error) {
  return {
    type: GET_WORKFLOWS_ERROR,
    error
  };
}

export function createWorkflow(workflow, published_id, autostart) {
  return dispatch => {
    dispatch(createWorkflowRequest());
    let uri = "/api/reana/create";

    axios
      .post(uri, {
        workflow_json: workflow.workflow,
        workflow_name: workflow.workflow_title,
        record_id: published_id
      })
      .then(response => {
        dispatch(createWorkflowSuccess(response.data));
        dispatch(push(`/published/${published_id}/runs`));
        if (autostart) {
          let { workflow_id } = response.data;
          dispatch(startWorkflow(workflow_id));
        }
      })
      .catch(error => {
        dispatch(createWorkflowError(error));
      });
  };
}

export function startWorkflow(workflow_id) {
  return dispatch => {
    dispatch(startWorkflowRequest());
    let uri = `/api/reana/start/${workflow_id}`;

    axios
      .get(uri)
      .then(response => {
        dispatch(startWorkflowSuccess(response.data));
      })
      .catch(error => {
        dispatch(startWorkflowError(error));
      });
  };
}

export function getWorkflows(published_id) {
  return dispatch => {
    dispatch(getWorkflowsRequest());
    let uri = `/api/reana/jobs/${published_id}`;

    axios
      .get(uri)
      .then(response => {
        let _jobs = {};
        response.data.map(job => (_jobs[job.reana_id] = job));
        dispatch(getWorkflowsSuccess(_jobs));
      })
      .catch(error => {
        dispatch(getWorkflowsError(error));
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
