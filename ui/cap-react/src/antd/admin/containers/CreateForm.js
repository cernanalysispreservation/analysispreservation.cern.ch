import { connect } from "react-redux";
import CreateForm from "../components/CreateForm";
import { createContentType } from "../../../actions/schemaWizard";

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  createContentType: data => dispatch(createContentType(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateForm);
