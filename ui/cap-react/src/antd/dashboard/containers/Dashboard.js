import { fetchDashboard } from "../../../actions/dashboard";
import Dashboard from "../components/Dashboard";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  loading: state.dashboard.get("loading"),
  results: state.dashboard.getIn(["results"]),
  groups: state.auth.getIn(["currentUser", "depositGroups"]),
});

const mapDispatchToProps = dispatch => ({
  fetchDashboard: () => dispatch(fetchDashboard()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
