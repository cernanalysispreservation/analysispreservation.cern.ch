import { connect } from "react-redux";
import Permissions from "../components/Permissions";
import { handlePermissions } from "../../../actions/draftItem";

const mapStateToProps = state => ({
  draft_id: state.draftItem.get("id"),
  draft: state.draftItem.get("data"),
  permissions: state.draftItem.get("access"),
  loading: state.draftItem.get("loading"),
  canAdmin: state.draftItem.get("can_admin"),
  created_by: state.draftItem.get("created_by")
});

const mapDispatchToProps = dispatch => ({
  handlePermissions: (draft_id, type, email, action, operation) =>
    dispatch(handlePermissions(draft_id, type, email, action, operation))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Permissions);
