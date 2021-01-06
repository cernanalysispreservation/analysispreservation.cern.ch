import { connect } from "react-redux";
import CustomizeField from "../components/SchemaWizard/PropertyEditor/customizeField";
import {
  updateSchemaByPath,
  updateUiSchemaByPath,
  deleteByPath,
  renameIdByPath
} from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  const _path = state.schemaWizard.present.getIn(["field", "path"]);
  const _uiPath = state.schemaWizard.present.getIn(["field", "uiPath"]);
  if (_path)
    return {
      schema: state.schemaWizard.present.getIn(["current", "schema", ..._path]),
      uiSchema: state.schemaWizard.present.getIn(["current", "uiSchema", ..._uiPath]),
      __path: state.schemaWizard.present.getIn(["field", "path"])
    };
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onSchemaChange: (path, schema) =>
      dispatch(updateSchemaByPath(path, schema)),
    onUiSchemaChange: (path, schema) =>
      dispatch(updateUiSchemaByPath(path, schema)),
    deleteByPath: item => dispatch(deleteByPath(item)),
    renameId: (item, newName) => dispatch(renameIdByPath(item, newName))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomizeField);
