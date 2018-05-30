import axios from 'axios';

export const PUBLISHED_REQUEST = 'PUBLISHED_REQUEST';
export const PUBLISHED_SUCCESS = 'PUBLISHED_SUCCESS';
export const PUBLISHED_ERROR = 'PUBLISHED_ERROR';

export const PUBLISHED_ITEM_REQUEST = 'PUBLISHED_ITEM_REQUEST';
export const PUBLISHED_ITEM_SUCCESS = 'PUBLISHED_ITEM_SUCCESS';
export const PUBLISHED_ITEM_ERROR = 'PUBLISHED_ITEM_ERROR';

export function publishedRequest(){
  return {
    type: PUBLISHED_REQUEST
  };
}

export function publishedSuccess(published) {
  return {
    type: PUBLISHED_SUCCESS,
    published
  };
}

export function publishedError(error) {
  return {
    type: PUBLISHED_ERROR,
    error
  };
}

export function publishedItemRequest(){
  return {
    type: PUBLISHED_ITEM_REQUEST
  };
}

export function publishedItemSuccess(published) {
  return {
    type: PUBLISHED_ITEM_SUCCESS,
    published
  };
}

export function publishedItemError(error) {
  return {
    type: PUBLISHED_ITEM_ERROR,
    error
  };
}


export function getPublished() {
  return function (dispatch) {
    dispatch(publishedRequest());

    let uri = '/api/records/';
    axios.get(uri)
      .then(function (response) {
        dispatch(publishedSuccess(response.data));
      })
      .catch(function (error) {
        dispatch(publishedError(error));
      });
  };
}

export function getPublishedItem(id) {
  return function (dispatch) {
    dispatch(publishedItemRequest());

    let uri = `/api/records/${id}`;
    axios.get(uri)
      .then(function (response) {
        dispatch(publishedItemSuccess(response.data));
      })
      .catch(function (error) {
        dispatch(publishedItemError(error.response.data));
      });
  };
}
