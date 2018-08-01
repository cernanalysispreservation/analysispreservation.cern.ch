import axios from "axios";

export const USERS_ITEM_REQUEST = "USERS_ITEM_REQUEST";
export const USERS_ITEM_SUCCESS = "USERS_ITEM_SUCCESS";
export const USERS_ITEM_ERROR = "USERS_ITEM_ERROR";

export function usersItemRequest() {
  return {
    type: USERS_ITEM_REQUEST
  };
}

export function usersItemSuccess(users) {
  return {
    type: USERS_ITEM_SUCCESS,
    users
  };
}

export function usersItemError(error) {
  return {
    type: USERS_ITEM_ERROR,
    error
  };
}

export function getUsers() {
  return function(dispatch) {
    dispatch(usersItemRequest);
    axios
      .get("/api/users")
      .then(function(response) {
        let users = response.data.hits.hits.map(item => ({
          email: item.email
        }));
        dispatch(usersItemSuccess(users));
      })
      .catch(function(error) {
        dispatch(usersItemError(error));
      });
  };
}
