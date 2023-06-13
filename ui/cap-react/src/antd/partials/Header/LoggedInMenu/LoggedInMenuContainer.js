import LoggedInMenu from "./LoggedInMenu";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => ({
  roles: state.auth.getIn(["currentUser", "roles"]),
});

export default withRouter(connect(mapStateToProps, null)(LoggedInMenu));
