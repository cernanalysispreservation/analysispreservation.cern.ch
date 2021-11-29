import { connect } from "react-redux";
import Settings from "../components/Settings";
import {
  publishDraft,
  updateDraft,
  deleteDraft
} from "../../../actions/draftItem";

const mapStateToProps = state => ({
  recid: state.draftItem.get("recid"),
  status: state.draftItem.get("status"),
  canUpdate: state.draftItem.get("can_update"),
  formData: state.draftItem.get("formData"),
  canAdmin: state.draftItem.get("can_admin"),
  metadata: state.draftItem.get("metadata"),
  draft_id: state.draftItem.get("id")
});

const mapDispatchToProps = dispatch => ({
  publishDraft: draft_id => dispatch(publishDraft(draft_id)),
  updateDraft: (data, draft_id) => dispatch(updateDraft(data, draft_id)),
  deleteDraft: draft_id => dispatch(deleteDraft(draft_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
