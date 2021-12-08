import { connect } from "react-redux";
import { uploadViaRepoUrl } from "../../../actions/files";
import Connect from "../components/Connect";

const mapStateToProps = state => ({
  repos: state.draftItem.get("webhooks"),
  canUpdate: state.draftItem.get("can_update"),
  id: state.draftItem.get("id")
});

const mapDispatchToProps = dispatch => ({
  uploadViaRepoUrl: (id, url, type, download, webhook, info) =>
    dispatch(uploadViaRepoUrl(id, url, type, download, webhook, info))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Connect);
