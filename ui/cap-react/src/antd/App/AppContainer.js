import { initCurrentUser } from "../../actions/auth";
import App from "./App";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => ({
  loadingInit: state.auth.get("loadingInit"),
  roles: state.auth.getIn(["currentUser", "roles"]),
});

const mapDispatchToProps = dispatch => ({
  initCurrentUser: next => dispatch(initCurrentUser(next)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
