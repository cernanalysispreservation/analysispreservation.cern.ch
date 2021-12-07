import { connect } from "react-redux";
import { publishedToDraftStatus } from "../../../actions/draftItem";
import Overview from "../components/Overview";

const mapStateToProps = state => ({
  schemas: state.draftItem.get("schemas"),
  mySchema: state.draftItem.get("schema"),
  canUpdate: state.draftItem.get("can_update"),
  canReview: state.draftItem.get("can_review"),
  draft_id: state.draftItem.get("id"),
  repositories: state.draftItem.get("repositories"),
  metadata: state.draftItem.get("metadata"),
  status: state.draftItem.get("status"),
  access: state.draftItem.get("access"),
  schema: state.draftItem.get("schema"),
  webhooks: state.draftItem.get("webhooks"),
  files: state.draftItem.get("bucket"),
  revision: state.draftItem.get("revision"),
  loading: state.draftItem.get("loading"),
  reviewLoading: state.draftItem.get("reviewLoading")
});

const mapDispatchToProps = dispatch => ({
  edit: draft_id => dispatch(publishedToDraftStatus(draft_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
