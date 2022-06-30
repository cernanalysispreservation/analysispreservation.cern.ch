import { connect } from "react-redux";

import SchemaTree from "../components/SchemaTree";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.getIn(["current", "schema"]),
    uiSchema: state.schemaWizard.getIn(["current", "uiSchema"])
  };
}

export default connect(mapStateToProps)(SchemaTree);
