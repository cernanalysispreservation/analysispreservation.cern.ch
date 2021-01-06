import { connect } from "react-redux";

import SchemaWizardHeader from "../components/SchemaWizard/SchemaWizardHeader";
import { withRouter } from "react-router-dom";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.present.getIn(["current", "schema"]),
    uiSchema: state.schemaWizard.present.getIn(["current", "uiSchema"]),
    initialSchema: state.schemaWizard.present.getIn(["initial", "schema"]),
    initialUiSchema: state.schemaWizard.present.getIn(["initial", "uiSchema"]),
    config: state.schemaWizard.present.get("config")
  };
}

function mapDispatchToProps() {
  return {};
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SchemaWizardHeader)
);
