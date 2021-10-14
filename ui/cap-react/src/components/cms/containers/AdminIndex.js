import { connect } from "react-redux";
import AdminIndex from "../AdminIndex";
import { getSchema } from "../../../actions/schemaWizard";
import { replacePath } from "../../../actions/support";

const mapDispatchToProps = dispatch => ({
  getSchema: (name, version) => dispatch(getSchema(name, version)),
  replacePath: path => dispatch(replacePath(path))
});

export default connect(
  state => state,
  mapDispatchToProps
)(AdminIndex);
