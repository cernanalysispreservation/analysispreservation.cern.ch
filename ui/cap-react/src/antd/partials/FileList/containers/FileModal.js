import { connect } from "react-redux";
import FileModal from "../components/FileModal";

const mapStateToProps = state => ({
  versions: state.draftItem.get("fileVersions")
});

export default connect(
  mapStateToProps,
  null
)(FileModal);
