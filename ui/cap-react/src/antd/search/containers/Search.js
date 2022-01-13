import { connect } from "react-redux";
import Search from "../components/Search";
import { fetchSearch } from "../../../actions/search";

const mapStateToProps = state => ({
  results: state.search.getIn(["results"]),
  loading: state.search.getIn(["loading"]),
  selectedAggs: state.search.getIn(["selectedAggs"]),
  error: state.search.getIn(["error"])
});

const mapDispatchToProps = dispatch => ({
  fetchSearch: match => dispatch(fetchSearch(match))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
