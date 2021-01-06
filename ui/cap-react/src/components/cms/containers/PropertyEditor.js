import { connect } from "react-redux";
import PropertyEditor from "../components/SchemaWizard/PropertyEditor";
import { addProperty, enableCreateMode } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    path: state.schemaWizard.present.getIn(["field"]),
    propKeyEditor: state.schemaWizard.present.get("propKeyEditor")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addProperty: (path, key) => dispatch(addProperty(path, key)),
    enableCreateMode: () => dispatch(enableCreateMode())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyEditor);
