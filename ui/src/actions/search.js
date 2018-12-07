import axios from "axios";
import queryString from "query-string";

export const QUERY_CHANGED = "QUERY_CHANGED";
export const ADD_AGGS = "ADD_AGGS";
export const REMOVE_AGGS = "REMOVE_AGGS";
export const CLEAR_SEARCH = "CLEAR_SEARCH";
export const PAGE_CHANGE = "PAGE_CHANGE";

export const SEARCH_REQUEST = "SEARCH_REQUEST";
export const SEARCH_SUCCESS = "SEARCH_SUCCESS";
export const SEARCH_ERROR = "SEARCH_ERROR";

export function searchRequest() {
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

export function fetchSearch(index = "deposits") {
  return function(dispatch, getState) {
    let searchApiUrl = `/api/${index}/`;

    let location_search = getState().routing.location.search;
    let params = queryString.parse(location_search);
    let searchUrl = `${searchApiUrl}/${location_search}`;

    if (!("sort" in params)) searchUrl += "&sort=mostrecent";

    dispatch(toggleAggs(params));
    dispatch(searchRequest());

    axios.get(searchUrl).then(response => {
      let results = response.data;
      dispatch(searchSuccess(results));
    });
  };
}

export function toggleAggs(selectedAggs) {
  return {
    type: ADD_AGGS,
    selectedAggs: selectedAggs
  };
}
