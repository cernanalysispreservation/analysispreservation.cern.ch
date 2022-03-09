import { connect } from "react-redux";
import { saveSchemaChanges } from "../../../actions/schemaWizard";
import { pushPath } from "../../../actions/support";
import Header from "../components/Header";

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
    saveSchemaChanges: () => dispatch(saveSchemaChanges()),
    pushPath: path => dispatch(pushPath(path))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
