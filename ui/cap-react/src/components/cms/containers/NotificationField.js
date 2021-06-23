import { connect } from "react-redux";
import { updateNotificationByIndex } from "../../../actions/schemaWizard";
import NotificationField from "../components/Notifications/NotificationWizard/NewNotification/NotificationField";

const mapStateToProps = state => ({
  selectedNotificationIndex: state.schemaWizard.get(
    "selectedNotificationIndex"
  ),
  selectedNotificationCategory: state.schemaWizard.get(
    "selectedNotificationCategory"
  )
});

const mapDispatchToProps = dispatch => ({
  updateNotificationByIndex: (key, value) =>
    dispatch(updateNotificationByIndex(key, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationField);
