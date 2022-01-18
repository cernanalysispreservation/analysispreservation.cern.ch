import { connect } from "react-redux";
import Editor from "../components/Editor";
import { initForm, formDataChange } from "../../../actions/draftItem";

import { fetchSchemaByNameVersion } from "../../../actions/common";

const mapStateToProps = state => ({
  all: state.draftItem.toJS(),
  schemaId: state.draftItem.get("schema"),
  draft_id: state.draftItem.get("id"),
  schemas: state.draftItem.get("schemas"),
  metadata: state.draftItem.get("metadata"),
  formData: state.draftItem.get("formData"),
  extraErrors: state.draftItem.get("extraErrors"),
  schemaErrors: state.draftItem.get("schemaErrors"),
  canUpdate: state.draftItem.get("can_update"),
  canAdmin: state.draftItem.get("can_admin")
});

const mapDispatchToProps = dispatch => ({
  fetchSchemaByNameVersion: name => dispatch(fetchSchemaByNameVersion(name)),
  initForm: () => dispatch(initForm()),
  formDataChange: data => dispatch(formDataChange(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
