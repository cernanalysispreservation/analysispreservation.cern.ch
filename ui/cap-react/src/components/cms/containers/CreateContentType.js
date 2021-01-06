import { connect } from "react-redux";
import CreateContentType from "../components/CMSIndex/CreateContentType";
import { createContentType } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    list: state.schemaWizard.present.get("list")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createContentType: data => dispatch(createContentType(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateContentType);
