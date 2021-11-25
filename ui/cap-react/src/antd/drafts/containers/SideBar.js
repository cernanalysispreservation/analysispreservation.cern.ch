import { connect } from "react-redux";
import SideBar from "../components/DraftSideBar/SideBar";
import { getBucketById } from "../../../actions/files";
import { toggleFilemanagerLayer } from "../../../actions/draftItem";

const mapStateToProps = state => ({
  files: state.draftItem.get("bucket"),
  id: state.draftItem.get("id"),
  recid: state.draftItem.get("recid"),
  status: state.draftItem.get("status"),
  schema: state.draftItem.get("schema"),
  experiment: state.draftItem.get("experiment"),
  revision: state.draftItem.get("revision"),
  created_by: state.draftItem.get("created_by"),
  created: state.draftItem.get("created"),
  updated: state.draftItem.get("updated"),
  canUpdate: state.draftItem.get("can_update"),
  canAdmin: state.draftItem.get("can_admin"),
  links: state.draftItem.get("links"),
  loading: state.draftItem.get("loading"),
  bucketError: state.draftItem.get("bucketError")
});

const mapDispatchToProps = dispatch => ({
  toggleFilemanagerLayer: () => dispatch(toggleFilemanagerLayer()),
  getBucketById: bucket_id => dispatch(getBucketById(bucket_id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
