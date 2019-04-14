import { connect } from "react-redux";

import SchemaTree from "../components/SchemaWizard/SchemaPreview/SchemaTree";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.getIn(["current", "schema"])
  };
}

export default connect(mapStateToProps)(SchemaTree);
