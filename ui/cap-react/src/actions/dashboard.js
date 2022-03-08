import axios from "axios";
import { notification } from "antd";

export const DASHBOARD_QUERY_REQUEST = "DASHBOARD_QUERY_REQUEST";
export const DASHBOARD_QUERY = "DASHBOARD_QUERY";
export const DASHBOARD_QUERY_ERROR = "DASHBOARD_QUERY_ERROR";

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
        notification.error({
          message: "Something went wrong",
          description: "fetching dashboard data was not possible"
        });
      });
  };
}
