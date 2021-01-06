import { connect } from "react-redux";
import ContentTypeDetails from "../components/SchemaWizard/ContentTypeDetails";

function mapStateToProps(state) {
  return {
    schema: state.schemaWizard.present.getIn(["current", "schema"]),
    path: state.schemaWizard.present.getIn(["field", "path"])
  };
}

export default connect(mapStateToProps)(ContentTypeDetails);
