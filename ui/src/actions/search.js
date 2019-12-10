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

const SEARCH_PATH_TO_INDEX = {
  "/search": "records",
  "/drafts": "deposits"
};

const DEFAULT_INDEX = "records";

export function fetchSearch(pathname, location_search) {
  return function(dispatch) {
    let index =
      pathname in SEARCH_PATH_TO_INDEX
        ? SEARCH_PATH_TO_INDEX[pathname]
        : DEFAULT_INDEX;
    let searchApiUrl = `/api/${index}`;

    // If query exists, remove "?" from string, since
    // we construct later
    if (location_search[0] == "?") location_search = location_search.substr(1);

    let params = queryString.parse(location_search);
    let searchUrl = `${searchApiUrl}?${location_search}`;

    if (!("sort" in params)) searchUrl += "&sort=mostrecent";

    dispatch(toggleAggs(params));
    dispatch(searchRequest());

    // TODO: there is no catch block for the request
    return axios.get(searchUrl).then(response => {
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
