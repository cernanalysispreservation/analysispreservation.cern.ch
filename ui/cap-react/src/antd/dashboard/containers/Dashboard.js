import { connect } from "react-redux";
import { fetchDashboard } from "../../../actions/dashboard";
import Dashboard from "../components/Dashboard";

const mapStateToProps = state => ({
  loading: state.dashboard.get("loading"),
  results: state.dashboard.getIn(["results"])
});

const mapDispatchToProps = dispatch => ({
  fetchDashboard: () => dispatch(fetchDashboard())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
