import { Map } from "immutable";

import {
  USERS_ITEM_REQUEST,
  USERS_ITEM_SUCCESS,
  USERS_ITEM_ERROR
} from "../actions/users";

const initialState = Map({
  loading: false,
  error: null,
  users: [{}]
});

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case USERS_ITEM_REQUEST:
      return state.set("loading", true).set("error", null);
    case USERS_ITEM_SUCCESS:
      return state.set("loading", false).set("users", action.users);
    case USERS_ITEM_ERROR:
      return state.set("loading", false).set("error", action.error);
    default:
      return state;
  }
}
