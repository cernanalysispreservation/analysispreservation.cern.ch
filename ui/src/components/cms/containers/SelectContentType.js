import { connect } from "react-redux";
import SelectContentType from "../components/CMSIndex/SelectContentType";
import { selectContentType } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    list: state.schemaWizard.get("list")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    select: id => dispatch(selectContentType(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectContentType);
