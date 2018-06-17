import axios from 'axios';
import queryString from 'query-string';

export const QUERY_CHANGED = 'QUERY_CHANGED';
export const ADD_AGGS = 'ADD_AGGS';
export const REMOVE_AGGS = 'REMOVE_AGGS';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const PAGE_CHANGE = 'PAGE_CHANGE';

export const SEARCH_REQUEST = 'SEARCH_REQUEST';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_ERROR = 'SEARCH_ERROR';

export const SEARCH_MINE_SUCCESS = 'SEARCH_MINE_SUCCESS';
export const SEARCH_MINE_ERROR = 'SEARCH_MINE_ERROR';

export function searchRequest(){
  return {
    type: SEARCH_REQUEST
  };
}

export function searchSuccess(results) {
  return {
    type: SEARCH_SUCCESS,
    results
  };
}

export function searchError(error) {
  return {
    type: SEARCH_ERROR,
    error
  };
}

export function searchMineSuccess(results) {
  return {
    type: SEARCH_MINE_SUCCESS,
    results
  };
}

export function searchMineError(error) {
  return {
    type: SEARCH_MINE_ERROR,
    error
  };
}

export function fetchSearch () {
  return function (dispatch, getState) {
    let searchApiUrl = '/api/deposits/';
    let location_search = getState().routing.location.search;
    const searchUrl = `${searchApiUrl}/${location_search}`;
    let params = queryString.parse(location_search);

    dispatch(toggleAggs(params));
    dispatch(searchRequest());

    axios
      .get(searchUrl)
      .then((response) => {
        let results = response.data;
        dispatch(searchSuccess(results));
      });
  };
}

export function fetchMine (id) {
  return function (dispatch, getState) {
    let searchApiUrl = '/api/deposits/';
    let location_search = `?q=_deposit.created_by:${id}`;
    const searchUrl = `${searchApiUrl}/${location_search}`;
    let params = queryString.parse(location_search);

    dispatch(toggleAggs(params));
    dispatch(searchRequest());

    axios
      .get(searchUrl)
      .then((response) => {
        let results = response.data;
        dispatch(searchMineSuccess(results));
      });
  };
}

export function toggleAggs(selectedAggs) {
  return {
    type: ADD_AGGS,
    selectedAggs: selectedAggs
  };
}

export function queryChanged(query) {
  return function (dispatch) {
    dispatch(fetchSearch(query));
  };
}

export function setQuery(query) {
  return {
    type: QUERY_CHANGED,
    query
  };
}