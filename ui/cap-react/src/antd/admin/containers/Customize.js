import { connect } from "react-redux";
import CustomizeField from "../components/Customize";
import {
  updateSchemaByPath,
  updateUiSchemaByPath
} from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  const _path = state.schemaWizard.getIn(["field", "path"]);
  const _uiPath = state.schemaWizard.getIn(["field", "uiPath"]);
  if (_path)
    return {
      schema: state.schemaWizard.getIn(["current", "schema", ..._path]),
      uiSchema: state.schemaWizard.getIn(["current", "uiSchema", ..._uiPath]),
      __path: state.schemaWizard.getIn(["field", "path"])
    };
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onSchemaChange: (path, schema) =>
      dispatch(updateSchemaByPath(path, schema)),
    onUiSchemaChange: (path, schema) =>
      dispatch(updateUiSchemaByPath(path, schema))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomizeField);
