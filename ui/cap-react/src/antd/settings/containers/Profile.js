import { connect } from "react-redux";
import Profile from "../components/Profile";

const mapStateToProps = state => ({
  user: state.auth.getIn(["currentUser", "profile"]),
  cernProfile: state.auth.getIn(["currentUser", "profile", "cern"])
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
