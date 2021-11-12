import { connect } from "react-redux";
import App from "./App";
import { withRouter } from "react-router-dom";
import { initCurrentUser } from "../../actions/auth";

const mapStateToProps = state => ({
  loadingInit: state.auth.get("loadingInit")
});

const mapDispatchToProps = dispatch => ({
  initCurrentUser: next => dispatch(initCurrentUser(next))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
