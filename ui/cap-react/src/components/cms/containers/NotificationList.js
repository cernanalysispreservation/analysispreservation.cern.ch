import { connect } from "react-redux";
import {
  setSelectedNotification,
  removeNotification,
  createNewNotification
} from "../../../actions/schemaWizard";
import NotificationList from "../components/Notifications/NotificationWizard/NotificationList";

const mapDispatchToProps = dispatch => ({
  setSelectedNotification: (notification, index, category) =>
    dispatch(setSelectedNotification(notification, index, category)),
  removeNotification: (index, category) =>
    dispatch(removeNotification(index, category)),
  createNewNotification: category => dispatch(createNewNotification(category))
});

const mapStateToProps = state => ({
  pathname: state.router.location.pathname
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationList);
