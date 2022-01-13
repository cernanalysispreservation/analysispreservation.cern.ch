import { connect } from "react-redux";
import Results from "../components/Results";

const mapStateToProps = state => ({
  user_id: state.auth.getIn(["currentUser", "userId"]),
  loading: state.search.getIn(["loading"])
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);
