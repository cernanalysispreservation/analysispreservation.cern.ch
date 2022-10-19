import { connect } from "react-redux";
import { uploadDefaultRepo, uploadViaRepoUrl } from "../../../actions/files";
import Connect from "../components/Connect";

const mapStateToProps = state => ({
  repos: state.draftItem.get("webhooks"),
  repoConfig: state.draftItem.get("schemas"),
  canUpdate: state.draftItem.get("can_update"),
  id: state.draftItem.get("id")
});

const mapDispatchToProps = dispatch => ({
  uploadViaRepoUrl: (id, url, type, download, webhook, info) =>
    dispatch(uploadViaRepoUrl(id, url, type, download, webhook, info)),
  uploadDefaultRepo: (id, type_name, config) => dispatch(uploadDefaultRepo(id, type_name, config))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Connect);
