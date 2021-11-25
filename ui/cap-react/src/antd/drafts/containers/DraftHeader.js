import { connect } from "react-redux";
import DraftHeader from "../components/DraftHeader";
import { updateGeneralTitle } from "../../../actions/draftItem";
import { pushPath } from "../../../actions/support";

const mapStateToProps = state => ({
  draft_id: state.draftItem.get("id"),
  status: state.draftItem.get("status"),
  canUpdate: state.draftItem.get("can_update"),
  canAdmin: state.draftItem.get("can_admin"),
  draft: state.draftItem.get("metadata"),
  schema: state.draftItem.get("schema"),
  formData: state.draftItem.get("formData"),
  metadata: state.draftItem.get("metadata"),
  loading: state.draftItem.get("loading")
});

const mapDispatchToProps = dispatch => ({
  updateGeneralTitle: (title, anaType) =>
    dispatch(updateGeneralTitle(title, anaType)),
  pushPath: path => dispatch(pushPath(path))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftHeader);
