import axios from "axios";
import { history } from "../store/configureStore";
import cogoToast from "cogo-toast";

import { piwik } from "../components/Root";

export const AUTHENTICATED = "AUTHENTICATED";
export const UNAUTHENTICATED = "UNAUTHENTICATED";

export const INIT_CURRENT_USER_REQUEST = "INIT_CURRENT_USER_REQUEST";
export const INIT_CURRENT_USER_SUCCESS = "INIT_CURRENT_USER_SUCCESS";
export const INIT_CURRENT_USER_ERROR = "INIT_CURRENT_USER_ERROR";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const API_KEY_LIST_REQUEST = "API_KEY_LIST_REQUEST";
export const API_KEY_LIST_SUCCESS = "API_KEY_LIST_SUCCESS";
export const API_KEY_LIST_ERROR = "API_KEY_LIST_ERROR";
export const CREATE_TOKEN_SUCCESS = "CREATE_TOKEN_SUCCESS";
export const REVOKE_TOKEN_SUCCESS = "REVOKE_TOKEN_SUCCESS";
export const REVOKE_TOKEN_ERROR = "REVOKE_TOKEN_ERROR";

export const INTEGRATIONS_UPDATE = "INTEGRATIONS_UPDATE";

export const UPDATE_DEPOSIT_GROUPS = "UPDATE_DEPOSIT_GROUPS";

export function depositGroupsUpdate(groups) {
  return {
    type: UPDATE_DEPOSIT_GROUPS,
    payload: groups
  };
}

export function initCurrentUserRequest() {
  return { type: INIT_CURRENT_USER_REQUEST };
}
export function initCurrentUserSuccess(user) {
  return { type: INIT_CURRENT_USER_SUCCESS, user };
}
export function initCurrentUserError(error) {
  return { type: INIT_CURRENT_USER_ERROR, error };
}

export function loginRequest() {
  return { type: LOGIN_REQUEST };
}
export function loginSuccess(user) {
  return { type: LOGIN_SUCCESS, user };
}
export function loginError(error) {
  return { type: LOGIN_ERROR, error };
}

export function logoutRequest() {
  return { type: LOGOUT_REQUEST };
}
export function logoutSuccess() {
  return { type: LOGOUT_SUCCESS };
}

export function authenticated() {
  return { type: AUTHENTICATED };
}
export function unauthenticated() {
  return { type: UNAUTHENTICATED };
}

export function apiKeyListRequest() {
  return { type: API_KEY_LIST_REQUEST };
}
export function apiKeyListSuccess(applications) {
  return { type: API_KEY_LIST_SUCCESS, applications };
}
export function apiKeyListError(error) {
  return { type: API_KEY_LIST_ERROR, error };
}

export function createTokenSuccess(token) {
  return { type: CREATE_TOKEN_SUCCESS, token };
}

export function revokeTokenSuccess(token) {
  return { type: REVOKE_TOKEN_SUCCESS, token };
}

export function loginLocalUser(data) {
  return function(dispatch) {
    dispatch(loginRequest());

    let uri = `/api/login/local?next=${data.next}`;
    axios
      .post(uri, data)
      .then(function(response) {
        let token = "12345";

        localStorage.setItem("token", token);

        // if the user tried to access priviledged location without login
        const { next } = response.data;

        dispatch(initCurrentUser(next));
      })
      .catch(function(error) {
        dispatch(
          loginError(
            error.response.data.error ||
              "Something went wrong with the login. Please try again-"
          )
        );
      });
  };
}

export function initCurrentUser(next = undefined) {
  return function(dispatch) {
    dispatch(initCurrentUserRequest());
    axios
      .get("/api/me")
      .then(function(response) {
        let { id, deposit_groups = [] } = response.data;
        localStorage.setItem("token", id);

        if (piwik) piwik.setUserId(response.data.email);
        dispatch(
          loginSuccess({
            userId: id,
            token: id,
            profile: response.data,
            depositGroups: deposit_groups,
            permissions: deposit_groups.length === 0 ? false : true
          })
        );
        dispatch(initCurrentUserSuccess());

        // if next is defined
        if (next) {
          history.push(next);
        }
      })
      .catch(function() {
        dispatch(clearAuth());
        dispatch(initCurrentUserError());
      });
  };
}
export function updateDepositGroups() {
  return function(dispatch) {
    axios
      .get("/api/me")
      .then(function(response) {
        let { deposit_groups = [] } = response.data;

        dispatch(depositGroupsUpdate(deposit_groups));
      })
      .catch(function() {
        cogoToast.error("Please try again", {
          position: "top-center",
          bar: { size: "0" },
          hideAfter: 3,
          heading: "There was an issue with your request"
        });
      });
  };
}

export function updateIntegrations() {
  return function(dispatch) {
    axios
      .get("/api/me")
      .then(function(response) {
        let { profile: { services: integrations = {} } = {} } = response.data;
        dispatch({
          type: INTEGRATIONS_UPDATE,
          integrations
        });
      })
      .catch(function() {});
  };
}

export function removeIntegrations(service) {
  return function(dispatch) {
    axios
      .get(`/api/auth/disconnect/${service}`)
      .then(function() {
        axios
          .get("/api/me")
          .then(function(response) {
            let {
              profile: { services: integrations = {} } = {}
            } = response.data;
            dispatch({
              type: INTEGRATIONS_UPDATE,
              integrations
            });
          })
          .catch(function() {});
      })
      .catch(function(error) {
        cogoToast.error(error.response.data.message, {
          position: "top-center",
          bar: { size: "0" },
          hideAfter: 3
        });
      });
  };
}

export function clearAuth() {
  return function(dispatch) {
    dispatch(logoutRequest());
    localStorage.clear();
    dispatch(logoutSuccess());
  };
}

export function logout() {
  return function(dispatch) {
    dispatch(logoutRequest());

    axios.get("/api/logout").then(function() {
      localStorage.clear();
      dispatch(logoutSuccess());
    });
  };
}

export function getUsersAPIKeys() {
  return function(dispatch) {
    dispatch(apiKeyListRequest());
    axios
      .get("/api/applications/")
      .then(function(response) {
        dispatch(apiKeyListSuccess(response.data));
      })
      .catch(function() {
        cogoToast.error("Please try again", {
          position: "top-center",
          bar: { size: "0" },
          hideAfter: 3,
          heading: "There was an error getting the API keys"
        });
      });
  };
}

export function createToken(data) {
  return function(dispatch) {
    // dispatch(apiKeyListRequest());
    axios
      .post("/api/applications/tokens/new/", data)
      .then(function(response) {
        dispatch(createTokenSuccess(response.data));
      })
      .catch(function() {
        cogoToast.error("Please try again", {
          position: "top-center",
          bar: { size: "0" },
          hideAfter: 3,
          heading: "There was an issue with your request"
        });
      });
  };
}

export function revokeToken(token_id) {
  return function(dispatch) {
    // dispatch(apiKeyListRequest());
    axios
      .get(`/api/applications/tokens/${token_id}/revoke/`)
      .then(function() {
        dispatch(revokeTokenSuccess(token_id));
      })
      .catch(function() {
        cogoToast.error("Please try again", {
          position: "top-center",
          bar: { size: "0" },
          hideAfter: 3,
          heading: "There was an issue with your request"
        });
      });
  };
}

export function createApplication() {
  return function(dispatch) {
    // dispatch(apiKeyListRequest());
    axios
      .get("/api/applications/")
      .then(function(response) {
        dispatch(apiKeyListSuccess(response.data));
      })
      .catch(function(error) {
        dispatch(apiKeyListError(error));
      });
  };
}
