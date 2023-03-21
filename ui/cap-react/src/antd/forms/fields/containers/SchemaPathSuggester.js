import { connect } from "react-redux";
import SchemaPathSuggester from "../SchemaPathSuggester";

function mapStateToProps(state) {
  return {
    fullSchema: state.schemaWizard.getIn(["current", "schema"]),
  };
}

export default connect(mapStateToProps)(SchemaPathSuggester);
