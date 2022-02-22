import { connect } from "react-redux";
import Header from "../components/Editor/Header";
import { updateDraft, editPublished } from "../../../actions/draftItem";
import { formErrorsChange } from "../../../actions/common";

const mapStateToProps = state => ({
  draft_id: state.draftItem.get("id"),
  draft: state.draftItem.get("metadata"),
  schema: state.draftItem.get("schema"),
  status: state.draftItem.get("status"),
  formData: state.draftItem.get("formData"),
  errors: state.draftItem.get("errors"),
  schemaErrors: state.draftItem.get("schemaErrors"),
  loading: state.draftItem.get("loading"),
  canUpdate: state.draftItem.get("can_update"),
  canAdmin: state.draftItem.get("can_admin")
});

const mapDispatchToProps = dispatch => ({
  updateDraft: (data, draft_id) => dispatch(updateDraft(data, draft_id)),
  editPublished: (data, schema, draft_id) =>
    dispatch(editPublished(data, schema, draft_id)),
  formErrorsChange: errors => dispatch(formErrorsChange(errors))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
