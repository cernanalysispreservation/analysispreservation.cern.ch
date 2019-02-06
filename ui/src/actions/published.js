import axios from "axios";
import { fetchAndAssignSchema } from "./common";

export const PUBLISHED_ITEM_REQUEST = "PUBLISHED_ITEM_REQUEST";
export const PUBLISHED_ITEM_SUCCESS = "PUBLISHED_ITEM_SUCCESS";
export const PUBLISHED_ITEM_ERROR = "PUBLISHED_ITEM_ERROR";

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
      .get(uri)
      .then(response => {
        dispatch(fetchAndAssignSchema(response.data.metadata.$schema));
        dispatch(publishedItemSuccess(response.data));
      })
      .catch(error => {
        dispatch(publishedItemError(error.response.data));
      });
  };
}
