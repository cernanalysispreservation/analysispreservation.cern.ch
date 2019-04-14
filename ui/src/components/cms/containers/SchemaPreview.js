import { connect } from "react-redux";

import SchemaPreview from "../components/SchemaWizard/SchemaPreview";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.getIn(["current", "schema"]),
    uiSchema: state.schemaWizard.getIn(["current", "uiSchema"])
  };
}

export default connect(mapStateToProps)(SchemaPreview);
