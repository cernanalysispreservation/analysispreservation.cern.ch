import { connect } from "react-redux";
import AdminIndex from "../AdminIndex";
import { getSchema } from "../../../actions/schemaWizard";

const mapDispatchToProps = dispatch => ({
  getSchema: (name, version) => dispatch(getSchema(name, version))
});

export default connect(
  state => state,
  mapDispatchToProps
)(AdminIndex);
