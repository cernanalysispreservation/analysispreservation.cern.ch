import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Box from 'grommet/components/Box';

import SearchFacets from './SearchFacets';
import SearchUtils from './SearchUtils';
import SearchResults from './SearchResults';

import {fetchSearch} from '../../actions/search';
import queryString from 'query-string';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchSearch();
  }

  _changePage(page){
    let currentParams = this.getSearchParams();

    const location = {
      search: `${queryString.stringify(Object.assign(currentParams,{page: page}))}`
    };

    this.props.history.push(location);
    this.props.fetchSearch();
  }

  _changePageSize(size){
    let currentParams = this.getSearchParams();
    const location = {
      search: `${queryString.stringify(Object.assign(currentParams,{size: size}))}`
    };

    this.props.history.push(location);
    this.props.fetchSearch();
  }

  componentWillReceiveProps(nextProps) {
    if ( this.props.location.search !== nextProps.location.search ) {
      this.props.fetchSearch()
    }
  }

  getSearchParams() {
    let params = queryString.parse(this.props.location.search);
    return params;
  }

  render() {
    let utils;
    let total = null;
    let results = null;
    let aggs = null;

    let _results = {};
    let _aggs;

    if (this.props.results) {
      _results = this.props.results.toJS();
      _aggs = _results.aggregations;
    }

    if (_aggs) {
      aggs = (
        <SearchFacets
          aggs={_aggs}
          selectedAggs={this.props.selectedAggs}
          onChange={this._toggleAggs}/>
      );
    }

    if (_results && _results.hits) {
      total = _results.hits.total;
      utils = (
        <SearchUtils
          loading={this.props.loading}
          currentPage={this.props.selectedAggs.page ? parseInt(this.props.selectedAggs.page) : 1}
          size={this.props.selectedAggs.size ? parseInt(this.props.selectedAggs.size) : 10}
          total={total || 0}
          onPageChange={this._changePage}
          onPageSizeChange={this._changePageSize}
        />
      );
      results = (<SearchResults results={_results.hits.hits || []} />);
    }

    return (
      <Box  flex={true}>
        {utils}
        <Box flex={true} direction="row">
          {aggs}
          {results}
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
  selectedAggs: PropTypes.array.isRequired,
  results: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    results: state.search.getIn(['results']),
    loading: state.search.getIn(['loading']),
    selectedAggs: state.search.getIn(['selectedAggs'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSearch: () => dispatch(fetchSearch()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPage);