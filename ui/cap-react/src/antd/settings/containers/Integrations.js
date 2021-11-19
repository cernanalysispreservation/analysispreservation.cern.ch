import { connect } from "react-redux";
import { updateIntegrations, removeIntegrations } from "../../../actions/auth";
import Integrations from "../components/Integrations/Integrations";

const mapStateToProps = state => ({
  integrations: state.auth.get("integrations")
});

const mapDispatchToProps = dispatch => ({
  updateIntegrations: () => dispatch(updateIntegrations()),
  removeIntegrations: service => dispatch(removeIntegrations(service))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Integrations);
