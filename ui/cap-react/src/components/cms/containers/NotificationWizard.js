import { connect } from "react-redux";
import NotificationWizard from "../components/Notifications/NotificationWizard/NotificationWizard";
import { pushPath } from "../../../actions/support";

const mapStateToProps = state => ({
  schemaConfig: state.schemaWizard.getIn([
    "config",
    "config",
    "notifications",
    "actions"
  ])
});

const mapDispatchToProps = dispatch => ({
  pushPath: path => dispatch(pushPath(path))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationWizard);
