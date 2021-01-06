import { connect } from "react-redux";

import SelectFieldType from "../components/SchemaWizard/PropertyEditor/SelectFieldType";
import { selectFieldType } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  const _path = state.schemaWizard.present.getIn(["field", "path"]);
  const _uiPath = state.schemaWizard.present.getIn(["field", "uiPath"]);

  return {
    // propKey: state.schemaWizard.getIn(["field", "propKey"]),
    path: state.schemaWizard.present.getIn(["field"]),
    schema: state.schemaWizard.present.getIn([
      "current",
      "schema",
      ...(_path || [])
    ]),
    uiSchema: state.schemaWizard.present.getIn([
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
