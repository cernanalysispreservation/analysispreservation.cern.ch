import { connect } from "react-redux";
import SelectContentType from "../components/SelectContentType";
import { selectContentType } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    contentTypes: state.auth.getIn(["currentUser", "depositGroups"])
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
