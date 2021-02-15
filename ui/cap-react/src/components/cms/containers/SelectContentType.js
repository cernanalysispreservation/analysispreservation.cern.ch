import { connect } from "react-redux";
import SelectContentType from "../components/CMSIndex/SelectContentType";
import { selectContentType } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    contentTypes: state.auth.getIn(["currentUser", "depositGroups"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    select: (id, version) => dispatch(selectContentType(id, version))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectContentType);
