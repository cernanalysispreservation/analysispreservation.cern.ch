import axios from "axios";
import cogoToast from "cogo-toast";

export const PUBLISHED_ITEM_REQUEST = "PUBLISHED_ITEM_REQUEST";
export const PUBLISHED_ITEM_SUCCESS = "PUBLISHED_ITEM_SUCCESS";
export const PUBLISHED_ITEM_ERROR = "PUBLISHED_ITEM_ERROR";

export const REVIEW_PUBISHED_REQUEST = "REVIEW_PUBLISHED_REQUEST";
export const REVIEW_PUBISHED_SUCCESS = "REVIEW_PUBLISHED_SUCCESS";
export const REVIEW_PUBISHED_ERROR = "REVIEW_PUBLISHED_ERROR";

export function reviewPublishedRequest() {
  return {
    type: REVIEW_PUBISHED_REQUEST
  };
}
export function reviewPublishedSuccess() {
  return {
    type: REVIEW_PUBISHED_SUCCESS
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
    axios
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

export function reviewPublished(review) {
  return (dispatch, getState) => {
    let state = getState();
    let uri = state.published.getIn(["links", "review"]);
    dispatch(reviewPublishedRequest());

    return axios
      .post(uri, review, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/form+json"
        }
      })
      .then(() => {
        cogoToast.success("Your review has been submitted", {
          position: "top-center",
          bar: { size: "0" },
          hideAfter: 3
        });
        return dispatch(reviewPublishedSuccess());
      })
      .catch(error => {
        return dispatch(reviewPublishedError(error.response.data));
      });
  };
}
