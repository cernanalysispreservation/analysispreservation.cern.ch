import { connect } from "react-redux";

import SchemaWizardHeader from "../components/SchemaWizard/SchemaWizardHeader";
import { updatePath } from "../../../actions/support";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.getIn(["current", "schema"]),
    uiSchema: state.schemaWizard.getIn(["current", "uiSchema"]),
    initialSchema: state.schemaWizard.getIn(["initial", "schema"]),
    initialUiSchema: state.schemaWizard.getIn(["initial", "uiSchema"]),
    config: state.schemaWizard.get("config"),
    pathname: state.router.location.pathname
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePath: path => dispatch(updatePath(path))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchemaWizardHeader);
