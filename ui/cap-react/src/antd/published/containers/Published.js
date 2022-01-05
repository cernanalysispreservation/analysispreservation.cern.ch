import { connect } from "react-redux";
import Published from "../components/Published";
import {
  getPublishedItem,
  clearPublishedState
} from "../../../actions/published";

const mapStateToProps = state => ({
  groups: state.auth.getIn(["currentUser", "depositGroups"]),
  item: state.published.getIn(["current_item", "data"]),
  error: state.published.get("error"),
  loading: state.published.get("loading")
});

const mapDispatchToProps = dispatch => ({
  getPublishedItem: id => dispatch(getPublishedItem(id)),
  clearPublishedState: () => dispatch(clearPublishedState())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Published);
