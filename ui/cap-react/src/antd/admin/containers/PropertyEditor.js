import { connect } from "react-redux";
import PropertyEditor from "../components/PropertyEditor";
import {
  addProperty,
  enableCreateMode,
  deleteByPath,
  renameIdByPath
} from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    path: state.schemaWizard.get("field"),
    propKeyEditor: state.schemaWizard.get("propKeyEditor")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addProperty: (path, key) => dispatch(addProperty(path, key)),
    enableCreateMode: () => dispatch(enableCreateMode()),
    deleteByPath: item => dispatch(deleteByPath(item)),
    renameId: (item, newName) => dispatch(renameIdByPath(item, newName))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyEditor);
