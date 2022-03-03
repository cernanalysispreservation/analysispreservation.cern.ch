import axios from "axios";
import { notification } from "antd";
export const PUBLISHED_ITEM_REQUEST = "PUBLISHED_ITEM_REQUEST";
export const PUBLISHED_ITEM_SUCCESS = "PUBLISHED_ITEM_SUCCESS";
export const PUBLISHED_ITEM_ERROR = "PUBLISHED_ITEM_ERROR";

export const REVIEW_PUBISHED_REQUEST = "REVIEW_PUBLISHED_REQUEST";
export const REVIEW_PUBISHED_SUCCESS = "REVIEW_PUBLISHED_SUCCESS";
export const REVIEW_PUBISHED_ERROR = "REVIEW_PUBLISHED_ERROR";

export const INIT_STATE = "INIT_STATE";

export function reviewPublishedRequest() {
  return {
    type: REVIEW_PUBISHED_REQUEST
  };
}
export function reviewPublishedSuccess(data) {
  return {
    type: REVIEW_PUBISHED_SUCCESS,
    payload: data
  };
}
export function reviewPublishedError(error) {
  return {
    type: REVIEW_PUBISHED_ERROR,
    error
  };
}

export function publishedItemRequest() {
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
export function clearPublishedState() {
  return {
    type: INIT_STATE
  };
}

export function publishedItemError(error) {
  return {
    type: PUBLISHED_ITEM_ERROR,
    error
  };
}

export function getPublishedItem(id) {
  return dispatch => {
    dispatch(publishedItemRequest());

    let uri = `/api/records/${id}`;
    return axios
      .get(uri, {
        headers: {
          Accept: "application/form+json",
          "Cache-Control": "no-cache"
        }
      })
      .then(response => {
        return dispatch(publishedItemSuccess(response.data));
      })
      .catch(error => {
        return dispatch(publishedItemError(error.response.data));
      });
  };
}

export function reviewPublished(review, message = "submitted") {
  return (dispatch, getState) => {
    let state = getState();
    let uri = state.published.get("links").review;
    dispatch(reviewPublishedRequest());

    return axios
      .post(uri, review, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/form+json"
        }
      })
      .then(response => {
        notification.success({
          description: `Your review has been ${message}`
        });
        return dispatch(reviewPublishedSuccess(response.data));
      })
      .catch(error => {
        return dispatch(reviewPublishedError(error.response.data));
      });
  };
}
