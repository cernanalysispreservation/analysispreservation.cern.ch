import { connect } from "react-redux";
import Applications from "../components/Applications";
import {
  getUsersAPIKeys,
  createToken,
  revokeToken
} from "../../../actions/auth";

const mapStateToProps = state => ({
  tokens: state.auth.get("tokens")
});

const mapDispatchToProps = dispatch => ({
  getUsersAPIKeys: () => dispatch(getUsersAPIKeys()),
  createToken: data => dispatch(createToken(data)),
  revokeToken: (t_id, key) => dispatch(revokeToken(t_id, key))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Applications);
