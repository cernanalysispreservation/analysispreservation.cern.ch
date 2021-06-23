import { connect } from "react-redux";
import NotificationWizard from "../components/Notifications/NotificationWizard/NotificationWizard";

const mapStateToProps = state => ({
  schemaConfig: state.schemaWizard.get("schemaConfig")
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationWizard);
