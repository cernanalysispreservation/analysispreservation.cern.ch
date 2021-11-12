import { connect } from "react-redux";
import QuickSearch from "../components/QuickSearch";
import { pushPath } from "../../../actions/support";

const mapDispatchToProps = dispatch => ({
  push: path => dispatch(pushPath(path))
});

export default connect(
  state => state,
  mapDispatchToProps
)(QuickSearch);
