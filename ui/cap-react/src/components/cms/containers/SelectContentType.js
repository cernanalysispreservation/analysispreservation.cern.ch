import { connect } from "react-redux";
import SelectContentType from "../components/CMSIndex/SelectContentType";
import { selectContentType, getSchemas } from "../../../actions/schemaWizard";

function mapStateToProps(state) {
  return {
    list: state.schemaWizard.present.get("list")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    select: (id, version) => dispatch(selectContentType(id, version)),
    getSchemas: () => dispatch(getSchemas())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectContentType);
