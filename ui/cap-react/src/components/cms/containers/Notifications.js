import { connect } from "react-redux";
import Notifications from "../components/Notifications/Notifications";

const mapStateToProps = state => ({
  schemaConfig: state.schemaWizard.get("schemaConfig"),
  pathname: state.router.location.pathname
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
