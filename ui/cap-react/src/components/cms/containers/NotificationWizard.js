import { connect } from "react-redux";
import NotificationWizard from "../components/Notifications/NotificationWizard/NotificationWizard";
import { updatePath } from "../../../actions/support";

const mapStateToProps = state => ({
  schemaConfig: state.schemaWizard.get("schemaConfig")
});

const mapDispatchToProps = dispatch => ({
  updatePath: path => dispatch(updatePath(path))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationWizard);
