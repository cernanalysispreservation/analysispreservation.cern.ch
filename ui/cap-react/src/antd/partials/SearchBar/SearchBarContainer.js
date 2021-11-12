import { connect } from "react-redux";
import SearchBar from "./SearchBar";
import { pushPath } from "../../../actions/support";

const mapDispatchToProps = dispatch => ({
  pushPath: path => dispatch(pushPath(path))
});

export default connect(
  state => state,
  mapDispatchToProps
)(SearchBar);
