import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import LoginForm from "./LoginForm";

const mapStateToProps = state => ({
  authLoading: state.auth.get("loading"),
  authError: state.auth.get("error")
});

export default withRouter(connect(
  mapStateToProps,
  null
)(LoginForm));
