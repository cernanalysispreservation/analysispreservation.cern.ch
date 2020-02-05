import { connect } from "react-redux";

import SchemaWizard from "../components/SchemaWizard";
import { getSchema } from "../../../actions/schemaWizard";

import { withRouter } from "react-router-dom";

function mapStateToProps(state) {
  return {
    current: state.schemaWizard.get("current"),
    field: state.schemaWizard.get("field"),
    selected: state.schemaWizard.get("selected"),
    loader: state.schemaWizard.get("loader")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSchema: (name, version) => dispatch(getSchema(name, version))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SchemaWizard)
);
