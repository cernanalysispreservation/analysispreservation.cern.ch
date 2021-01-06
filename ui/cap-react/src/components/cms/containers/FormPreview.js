import { connect } from "react-redux";

import FormPreview from "../components/SchemaWizard/FormPreview";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.present.getIn(["current", "schema"]),
    uiSchema: state.schemaWizard.present.getIn(["current", "uiSchema"])
  };
}

export default connect(mapStateToProps)(FormPreview);
