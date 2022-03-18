import { connect } from "react-redux";
import Notifications from "../components/Notifications";

const mapStateToProps = state => ({
  schemaConfig: state.schemaWizard.getIn([
    "config",
    "config",
    "notifications",
    "actions"
  ]),
  pathname: state.router.location.pathname
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
