import { connect } from "react-redux";
import Header from "./Header";
import { logout } from "../../../actions/auth";

const mapStateToProps = state => ({
  permissions: state.auth.getIn(["currentUser", "permissions"])
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
