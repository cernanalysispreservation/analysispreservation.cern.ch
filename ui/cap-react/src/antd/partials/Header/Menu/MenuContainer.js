import { connect } from "react-redux";
import Menu from "./Menu";
import { loginLocalUser, initCurrentUser } from "../../../../actions/auth";

const mapStateToProps = state => ({
  location: state.router.location
});

const mapDispatchToProps = dispatch => ({
  loginLocalUser: data => dispatch(loginLocalUser(data)),
  initCurrentUser: next => dispatch(initCurrentUser(next))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
