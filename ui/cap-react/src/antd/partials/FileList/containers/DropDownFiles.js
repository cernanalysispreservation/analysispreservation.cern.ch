import { connect } from "react-redux";
import DropDownFiles from "../components/DropDownFiles";
import { deleteFileByUri, getFileVersions } from "../../../../actions/files";

const mapStateToProps = state => ({
  status: state.draftItem.get("status"),
  canUpdate: state.draftItem.get("can_update"),
  versions: state.draftItem.get("fileVersions"),
  versionLoading: state.draftItem.get("versionLoading"),
});

const mapDispatchToProps = dispatch => ({
  deleteFile: (file_uri, filepath) =>
    dispatch(deleteFileByUri(file_uri, filepath)),
  getFileVersions: () => dispatch(getFileVersions()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropDownFiles);
