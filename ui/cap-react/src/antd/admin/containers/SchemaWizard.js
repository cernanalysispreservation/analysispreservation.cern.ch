import { connect } from "react-redux";

import SchemaWizard from "../components/SchemaWizard";

function mapStateToProps(state) {
  return {
    field: state.schemaWizard.get("field"),
    loader: state.schemaWizard.get("loader")
  };
}

export default connect(
  mapStateToProps,
  null
)(SchemaWizard);
