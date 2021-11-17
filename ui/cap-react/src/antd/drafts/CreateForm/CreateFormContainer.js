import { connect } from "react-redux";
import CreateForm from "./CreateForm";
import { createDraft } from "../../../actions/draftItem";

const mapStateToProps = state => ({
  id: state.draftItem.get("id"),
  metadata: state.draftItem.get("metadata"),
  formData: state.draftItem.get("formData"),
  contentTypes: state.auth.getIn(["currentUser", "depositGroups"])
});

const mapDispatchToProps = dispatch => ({
  createDraft: (data, type) => dispatch(createDraft(data, type))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateForm);
