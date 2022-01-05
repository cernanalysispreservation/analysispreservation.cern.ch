import { connect } from "react-redux";
import Preview from "../components/Preview";

const mapStateToProps = state => ({
  id: state.published.get("id"),
  draft_id: state.published.get("draft_id"),
  canUpdate: state.published.get("can_update"),
  canReview: state.published.get("can_review"),
  metadata: state.published.get("metadata"),
  files: state.published.get("files"),
  schemas: state.published.get("schemas"),
  schemaType: state.published.get("schema"),
  status: state.published.get("status")
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preview);
