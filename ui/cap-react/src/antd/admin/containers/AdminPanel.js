import { connect } from "react-redux";
import AdminPanel from "../components/AdminPanel";
import { getSchema } from "../../../actions/builder";

const mapStateToProps = state => ({
  loading: state.builder.get("loading"),
  mosesState: state.builder.get("mosesState"),
});

const mapDispatchToProps = dispatch => ({
  getSchema: (name, version) => dispatch(getSchema(name, version)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);
