import { connect } from "react-redux";
import NewNotification from "../components/Notifications/NotificationWizard/NewNotification";
import { updatePath } from "../../../actions/support";
import { updateNotificationData } from "../../../actions/schemaWizard";

const mapStateToProps = state => ({
  selectedNotification: state.schemaWizard.getIn([
    "config",
    "config",
    "notifications",
    "actions"
  ])
});

const mapDispatchToProps = dispatch => ({
  updatePath: path => dispatch(updatePath(path)),
  updateNotificationData: (data, id, category) =>
    dispatch(updateNotificationData(data, id, category))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewNotification);
