import { connect } from "react-redux";

import SchemaWizard from "../components/SchemaWizard";

function mapStateToProps(state) {
  return {
    current: state.schemaWizard.get("current"),
    field: state.schemaWizard.get("field")
  };
}

export default connect(mapStateToProps)(SchemaWizard);
