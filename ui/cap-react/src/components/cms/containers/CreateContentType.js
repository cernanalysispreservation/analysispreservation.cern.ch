import { connect } from "react-redux";
import CreateContentType from "../components/CMSIndex/CreateContentType";
import { createContentType } from "../../../actions/schemaWizard";

function mapDispatchToProps(dispatch) {
  return {
    createContentType: data => dispatch(createContentType(data))
  };
}

export default connect(
  state => state,
  mapDispatchToProps
)(CreateContentType);
