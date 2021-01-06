import { connect } from "react-redux";

import SchemaTree from "../components/SchemaWizard/SchemaPreview/SchemaTree";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.present.getIn(["current", "schema"]),
    uiSchema: state.schemaWizard.present.getIn(["current", "uiSchema"])
  };
}

export default connect(mapStateToProps)(SchemaTree);
