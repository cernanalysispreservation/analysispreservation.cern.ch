import { connect } from "react-redux";
import Create from "./Create";

const mapStateToProps = state => ({
  contentTypes: state.auth.getIn(["currentUser", "depositGroups"])
});

export default connect(
  mapStateToProps,
  null
)(Create);
