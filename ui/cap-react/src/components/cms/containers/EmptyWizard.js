import { connect } from "react-redux";
import EmptyWizard from "../components/Notifications/NotificationWizard/EmptyWizard";
import { createNewNotification } from "../../../actions/schemaWizard";

const mapDispatchToProps = dispatch => ({
  createNewNotification: category => dispatch(createNewNotification(category))
});

export default connect(
  state => state,
  mapDispatchToProps
)(EmptyWizard);
