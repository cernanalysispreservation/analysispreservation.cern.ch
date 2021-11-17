import { connect } from "react-redux";
import DraftCreate from "./DraftCreate";
import { createDraft } from "../../../actions/draftItem";

const mapDispatchToProps = dispatch => ({
  createDraft: (data, type) => dispatch(createDraft(data, type))
});

export default connect(
  state => state,
  mapDispatchToProps
)(DraftCreate);
