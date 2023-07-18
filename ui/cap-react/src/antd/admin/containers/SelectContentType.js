import { connect } from "react-redux";
import SelectContentType from "../components/SelectContentType";
import {
  selectContentTypeEdit,
  selectContentTypeView,
} from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    contentTypes: state.auth.getIn(["currentUser", "depositGroups"]),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectEdit: id => dispatch(selectContentTypeEdit(id)),
    selectView: id => dispatch(selectContentTypeView(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectContentType);
