import { connect } from "react-redux";
import Drafts from "../components/Drafts";
import { getDraftByIdAndInitForm } from "../../../actions/draftItem";

const mapStateToProps = state => ({
  id: state.draftItem.get("id"),
  status: state.draftItem.get("status"),
  errors: state.draftItem.get("errors"),
  recid: state.draftItem.get("recid"),
  metadata: state.draftItem.get("metadata")
});

const mapDispatchToProps = dispatch => ({
  getDraftById: id => dispatch(getDraftByIdAndInitForm(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drafts);
