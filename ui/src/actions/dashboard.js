import axios from "axios";

export const DASHBOARD_QUERY = "DASHBOARD_QUERY";

export function dashboardQuery(results) {
  return {
    type: DASHBOARD_QUERY,
    results
  };
}

export function fetchDashboard() {
  return dispatch => {
    let url = "/api/dashboard";

    axios.get(url).then(response => {
      let results = response.data;
      dispatch(dashboardQuery(results));
    });
  };
}
