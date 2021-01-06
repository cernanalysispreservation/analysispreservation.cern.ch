import { connect } from "react-redux";

import SchemaWizard from "../components/SchemaWizard";
import { getSchema } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    current: state.schemaWizard.present.get("current"),
    field: state.schemaWizard.present.get("field"),
    loader: state.schemaWizard.present.get("loader"),
    schema: state.schemaWizard.present.getIn(["current", "schema"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSchema: (name, version) => dispatch(getSchema(name, version))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemaWizard);
