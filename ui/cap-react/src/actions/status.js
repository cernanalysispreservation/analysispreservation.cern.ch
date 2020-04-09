import axios from "axios";

/**
 * Actions const type
 */
export const FETCH_SERVICES_REQUEST = "FETCH_SERVICES_REQUEST";
export const FETCH_SERVICES_SUCCESS = "FETCH_SERVICES_SUCCESS";
export const FETCH_SERVICES_ERROR = "FETCH_SERVICES_ERROR";

/**
 * Actions functions
 */
export function fetchServicesRequest() {
  return {
    type: FETCH_SERVICES_REQUEST
  };
}

export function fetchServicesSuccess(services) {
  return {
    type: FETCH_SERVICES_SUCCESS,
    payload: services
  };
}

export function fetchServicesError(error) {
  return {
    type: FETCH_SERVICES_ERROR,
    error
  };
}

export function fetchServicesStatus() {
  return function(dispatch) {
    // set loader on
    dispatch(fetchServicesRequest());

    // fetch data
    axios
      .get("/api/services/status")
      .then(response => {
        dispatch(fetchServicesSuccess(response.data));
      })
      .catch(error => dispatch(fetchServicesError(error)));
  };
}
