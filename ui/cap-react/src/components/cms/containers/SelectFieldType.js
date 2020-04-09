import { connect } from "react-redux";

import SelectFieldType from "../components/SchemaWizard/PropertyEditor/SelectFieldType";
import { selectFieldType } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  const _path = state.schemaWizard.getIn(["field", "path"]);
  const _uiPath = state.schemaWizard.getIn(["field", "uiPath"]);

  return {
    // propKey: state.schemaWizard.getIn(["field", "propKey"]),
    selected: state.schemaWizard.get("selected"),
    path: state.schemaWizard.getIn(["field"]),
    schema: state.schemaWizard.getIn(["current", "schema", ...(_path || [])]),
    uiSchema: state.schemaWizard.getIn([
      "current",
      "uiSchema",
      ...(_uiPath || [])
    ])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectFieldType: (path, type) => dispatch(selectFieldType(path, type))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectFieldType);
