import { connect } from "react-redux";
import Facets from "../components/Facets";
const mapStateToProps = state => ({
  selectedAggs: state.search.getIn(["selectedAggs"]),
  loading: state.search.getIn(["loading"]),
  pathname: state.router.location.pathname,
  location: state.router.location
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Facets);
