import { connect } from "react-redux";

import SchemaWizardHeader from "../components/SchemaWizard/SchemaWizardHeader";
import { withRouter } from "react-router-dom";
import { saveSchemaChanges } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.getIn(["current", "schema"]),
    uiSchema: state.schemaWizard.getIn(["current", "uiSchema"]),
    initialSchema: state.schemaWizard.getIn(["initial", "schema"]),
    initialUiSchema: state.schemaWizard.getIn(["initial", "uiSchema"]),
    config: state.schemaWizard.get("config"),
    contentTypes: state.auth.getIn(["currentUser", "depositGroups"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveSchemaChanges: () => dispatch(saveSchemaChanges())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SchemaWizardHeader)
);
