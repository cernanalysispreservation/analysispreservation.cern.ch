import { connect } from "react-redux";
import { initSchemaWizard } from "../../../actions/schemaWizard";
import DropZoneForm from "../components/DropZoneForm";

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  initWizard: data => dispatch(initSchemaWizard(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropZoneForm);
