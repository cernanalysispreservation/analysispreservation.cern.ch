import { connect } from "react-redux";

import FormPreview from "../components/FormPreview";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.getIn(["current", "schema"]),
    uiSchema: state.schemaWizard.getIn(["current", "uiSchema"])
  };
}

export default connect(mapStateToProps)(FormPreview);
