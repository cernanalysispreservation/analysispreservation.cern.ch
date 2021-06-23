import { connect } from "react-redux";
import {
  removeNotification,
  createNewNotification
} from "../../../actions/schemaWizard";
import NotificationList from "../components/Notifications/NotificationWizard/NotificationList";

const mapDispatchToProps = dispatch => ({
  removeNotification: (index, category) =>
    dispatch(removeNotification(index, category)),
  createNewNotification: category => dispatch(createNewNotification(category))
});

const mapStateToProps = state => ({
  pathname: state.router.location.pathname,
  schemaConfig: state.schemaWizard.getIn([
    "config",
    "config",
    "notifications",
    "actions"
  ])
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationList);
