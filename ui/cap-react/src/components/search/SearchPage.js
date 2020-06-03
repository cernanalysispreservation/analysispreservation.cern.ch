import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import { FiSliders } from "react-icons/fi";
import Empty from "../../img/empty_search.svg";

import SearchFacets from "./SearchFacets";
import SearchUtils from "./SearchUtils";
import SearchResults from "./SearchResults";
import SearchTag from "./SearchTag";

import { fetchSearch } from "../../actions/search";
import queryString from "query-string";

import SearchResultHeading from "./SearchResultHeading";
import SearchResultsLoading from "./SearchResultsLoading";
import SearchFilterLayer from "./SearchFilterLayer";

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layerActive: false
    };
  }

  componentDidMount() {
    let { pathname, search } = this.props.location;
    this.props.fetchSearch(pathname, search);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      let { pathname, search } = this.props.location;
      this.props.fetchSearch(pathname, search);
    }
  }

  _changePageSize(size) {
    let currentParams = queryString.parse(this.props.location.search);
    const location = {
      search: `${queryString.stringify(
        Object.assign(currentParams, { size: size })
      )}`
    };

    this.props.history.push(location);
    this.props.fetchSearch();
  }

  _updateParams = item => {
    let removableItem = this.props.location.search.includes(`&${item}`)
      ? `&${item}`
      : `?${item}`;

    const location = {
      search: this.props.location.search.replace(removableItem, "")
    };
    this.props.history.push(location);
  };

  _updateSearchQuery = () => {
    const location = {
      search: this.props.location.search.split("q=")[0]
    };
    location.search = location.search + "q=";
    this.props.history.push(location);
  };

  _changePage(page) {
    let currentParams = queryString.parse(this.props.location.search);

    const location = {
      search: `${queryString.stringify(
        Object.assign(currentParams, { page: page })
      )}`
    };
    this.props.history.push(location);
  }

  render() {
    let utils;
    let total = null;
    let results = null;
    let queryParams = [];

    let _results = {};
    let _aggs;

    let searchQuery = "";

    if (this.props.results) {
      _results = this.props.results.toJS();
      _aggs = _results.aggregations;
    }

    if (this.props.location && this.props.location.search) {
      let splitted = this.props.location.search.split("q=");
      searchQuery = splitted[1];
      queryParams = splitted[0]
        .replace("?", "")
        .split("&")
        .filter(item => item != "")
        .filter(item => !item.includes("by_me"))
        .filter(item => !item.includes("page"));
    }

    if (_results && _results.hits) {
      total = _results.hits.total;
      utils = (
        <SearchUtils
          loading={this.props.loading}
          currentPage={
            this.props.selectedAggs.page
              ? parseInt(this.props.selectedAggs.page)
              : 1
          }
          size={
            this.props.selectedAggs.size
              ? parseInt(this.props.selectedAggs.size)
              : 10
          }
          total={total || 0}
          onPageChange={this._changePage.bind(this)}
          onPageSizeChange={this._changePageSize.bind(this)}
        />
      );

      results = this.props.loading ? (
        <Box flex={false} justify="center" direction="row">
          <Box justify="center" align="end">
            <SearchResultsLoading />
          </Box>
        </Box>
      ) : this.props.error ? (
        <Box flex={false} justify="center" align="center">
          <Empty />
          <Label style={{ textAlign: "center" }}>
            There was an error with your request <br />
            pleaase try again
          </Label>
        </Box>
      ) : total === 0 ? (
        <Box flex={false} justify="center" align="center">
          <Empty />
          <Label style={{ textAlign: "center" }}>
            No search results were found <br />or <br />you have no permission
            to see them
          </Label>
        </Box>
      ) : (
        <Box align="end">
          <SearchResults results={_results.hits.hits || []} />
          {utils}
        </Box>
      );
    }

    return (
      <Box
        flex={false}
        align="center"
        colorIndex="light-2"
        style={{ minHeight: "100%" }}
      >
        <SearchFilterLayer
          active={this.state.layerActive}
          onClose={() => this.setState({ layerActive: false })}
          properties={
            <SearchFacets
              aggs={_aggs}
              selectedAggs={this.props.selectedAggs}
              onChange={this._toggleAggs}
            />
          }
        />

        <Box direction="row">
          <Box id="sidebar">
            <SearchFacets
              aggs={_aggs}
              selectedAggs={this.props.selectedAggs}
              onChange={this._toggleAggs}
            />
          </Box>
          <Box pad="medium">
            <Box
              direction="row"
              align="start"
              justify="between"
              responsive={false}
              margin={{ bottom: "small" }}
            >
              <SearchResultHeading results={_results.hits.total} />
              <Box
                colorIndex="brand"
                id="sidebar_button"
                pad="small"
                align="center"
                justify="center"
                direction="row"
                responsive={false}
                onClick={() => this.setState({ layerActive: true })}
              >
                <Box style={{ margin: "0 5px" }}>
                  <FiSliders />
                </Box>
                {queryParams.length > 0
                  ? `Filters (${queryParams.length})`
                  : "Filters"}
              </Box>
            </Box>
            <SearchTag
              query={queryParams}
              onClick={this._updateParams}
              searchQuery={searchQuery}
              removeQuery={this._updateSearchQuery}
            />
            {results}
          </Box>
        </Box>
      </Box>
    );
  }
}

SearchPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  fetchSearch: PropTypes.func,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  selectedAggs: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired,
  error: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    results: state.search.getIn(["results"]),
    loading: state.search.getIn(["loading"]),
    selectedAggs: state.search.getIn(["selectedAggs"]),
    error: state.search.getIn(["error"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSearch: (pathname, location_search) =>
      dispatch(fetchSearch(pathname, location_search))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SearchPage));
