import axios from "axios";

export const DASHBOARD_QUERY_REQUEST = "DASHBOARD_QUERY_REQUEST";
export const DASHBOARD_QUERY = "DASHBOARD_QUERY";
export const DASHBOARD_QUERY_ERROR = "DASHBOARD_QUERY_ERROR";

import cogoToast from "cogo-toast";

export function dashboardQueryRequest() {
  return {
    type: DASHBOARD_QUERY_REQUEST
  };
}
export function dashboardQuerySuccess(results) {
  return {
    type: DASHBOARD_QUERY,
    results
  };
}
export function dashboardQueryError() {
  return {
    type: DASHBOARD_QUERY_ERROR
  };
}
export function fetchDashboard() {
  return dispatch => {
    dispatch(dashboardQueryRequest());
    let url = "/api/dashboard";

    return axios
      .get(url)
      .then(response => {
        let results = response.data;
        dispatch(dashboardQuerySuccess(results));
      })
      .catch(() => {
        dispatch(dashboardQueryError());
        cogoToast.error("fetching dashboard data was not possible", {
          position: "top-center",
          heading: "Something went wrong",
          bar: { size: "0" },
          hideAfter: 5
        });
      });
  };
}
