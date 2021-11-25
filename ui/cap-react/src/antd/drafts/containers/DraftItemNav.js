import { connect } from "react-redux";
import DraftItemNav from "../components/DraftItemNav";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => ({
  id: state.draftItem.get("id"),
  status: state.draftItem.get("status"),
  formErrors: state.draftItem.get("formErrors"),
  recid: state.draftItem.get("recid")
});

const mapDispatchToProps = {};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftItemNav)
);
