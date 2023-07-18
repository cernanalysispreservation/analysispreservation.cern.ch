import { connect } from "react-redux";
import { pushPath } from "../../../actions/support";
import Schemas from "../components/Schemas";

const mapDispatchToProps = dispatch => ({
  pushPath: path => dispatch(pushPath(path)),
});

export default connect(null, mapDispatchToProps)(Schemas);
