import { connect } from "react-redux";
import ContentTypeDetails from "../components/SchemaWizard/ContentTypeDetails";
import { updateCurrentSchemaWithField } from "../../../actions/schemaWizard";

function mapStateToProps(state, props) {
  // const _path = props.propKey ? [...props.path, props.propKey] : props.path;
  return {
    schema: state.schemaWizard.getIn(["current", "schema"]),
    path: state.schemaWizard.getIn(["field", "path"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // onSchemaChange: schema => dispatch(updateCurrentSchemaWithField(schema))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentTypeDetails);
