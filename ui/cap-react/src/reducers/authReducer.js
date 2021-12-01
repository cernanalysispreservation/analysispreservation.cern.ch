import { Map, List, fromJS } from "immutable";

import {
  AUTHENTICATED,
  UNAUTHENTICATED,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGIN_ERROR,
  API_KEY_LIST_SUCCESS,
  CREATE_TOKEN_SUCCESS,
  REVOKE_TOKEN_SUCCESS,
  INIT_CURRENT_USER_REQUEST,
  INIT_CURRENT_USER_SUCCESS,
  INIT_CURRENT_USER_ERROR,
  INTEGRATIONS_UPDATE,
  UPDATE_DEPOSIT_GROUPS
} from "../actions/auth";

const initialState = Map({
  isLoggedIn: false,
  currentUser: Map({}),
  token: localStorage.getItem("token"),
  error: null,
  loading: false,
  loadingInit: true,
  tokens: List(),
  integrations: Map({})
});

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATED:
      return state.set("isLoggedIn", true);
    case UNAUTHENTICATED:
      return state.set("isLoggedIn", false);
    case INIT_CURRENT_USER_REQUEST:
      return state.set("loadingInit", true);
    case INIT_CURRENT_USER_SUCCESS:
      return state.set("loadingInit", false);
    case INIT_CURRENT_USER_ERROR:
      return state.set("loadingInit", false);
    case LOGIN_REQUEST:
      return state.set("error", null).set("loading", true);
    case LOGIN_SUCCESS:
      return state
        .set("isLoggedIn", true)
        .set("currentUser", fromJS(action.user))
        .set(
          "integrations",
          action.user.profile &&
          action.user.profile.profile &&
          action.user.profile.profile.services
            ? action.user.profile.profile.services
            : {}
        )
        .set("loading", false);
    case LOGIN_ERROR:
      return state.set("error", action.error).set("loading", false);
    case LOGOUT_REQUEST:
      return state.set("loading", true);
    case LOGOUT_SUCCESS:
      return state
        .set("isLoggedIn", false)
        .set("currentUser", null)
        .set("loading", false);
    case INTEGRATIONS_UPDATE:
      return state.set("integrations", action.integrations);
    case API_KEY_LIST_SUCCESS:
      return state.set("tokens", List(action.applications.tokens));
    case CREATE_TOKEN_SUCCESS:
      return state.set("tokens", state.get("tokens").push(action.token));
    case REVOKE_TOKEN_SUCCESS:
      return state.set(
        "tokens",
        state.get("tokens").filter(item => item.t_id != action.token)
      );
    case UPDATE_DEPOSIT_GROUPS:
      return state.setIn(
        ["currentUser", "depositGroups"],
        fromJS(action.payload)
      );
    // case REVOKE_TOKEN_ERROR:
    //   return state
    default:
      return state;
  }
}
