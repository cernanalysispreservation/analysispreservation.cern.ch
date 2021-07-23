import { connect } from "react-redux";
import NotificationWizard from "../components/Notifications/NotificationWizard/NotificationWizard";

const mapStateToProps = state => ({
  schemaConfig: state.schemaWizard.get("schemaConfig")
});

export default connect(
  mapStateToProps,
  null
)(NotificationWizard);
