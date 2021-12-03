import { connect } from "react-redux";
import FileManager from "../components/FileManager";
import { uploadFile, deleteFileByUri } from "../../../actions/files";

const mapStateToProps = state => ({
  links: state.draftItem.get("links"),
  filesToUpload: state.draftItem.get("uploadFiles")
});

const mapDispatchToProps = dispatch => ({
  uploadFile: (bucket_url, file, filename, tags) =>
    dispatch(uploadFile(bucket_url, file, filename, tags)),
  deleteFile: (file_uri, filepath) =>
    dispatch(deleteFileByUri(file_uri, filepath))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileManager);
