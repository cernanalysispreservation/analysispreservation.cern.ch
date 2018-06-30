import axios from 'axios';

export const AUTHENTICATED = 'AUTHENTICATED';
export const UNAUTHENTICATED = 'UNAUTHENTICATED';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const API_KEY_LIST_REQUEST = 'API_KEY_LIST_REQUEST';
export const API_KEY_LIST_SUCCESS = 'API_KEY_LIST_SUCCESS';
export const API_KEY_LIST_ERROR = 'API_KEY_LIST_ERROR';
export const CREATE_TOKEN_SUCCESS = 'CREATE_TOKEN_SUCCESS';
export const CREATE_TOKEN_ERROR = 'CREATE_TOKEN_ERROR';
export const REVOKE_TOKEN_SUCCESS = 'REVOKE_TOKEN_SUCCESS';
export const REVOKE_TOKEN_ERROR = 'REVOKE_TOKEN_ERROR';


export function loginRequest() { return { type: LOGIN_REQUEST }; }
export function loginSuccess(user) { return { type: LOGIN_SUCCESS, user }; }
export function loginError(error) { return { type: LOGIN_ERROR, error }; }

export function logoutRequest() { return { type: LOGOUT_REQUEST }; }
export function logoutSuccess() { return { type: LOGOUT_SUCCESS }; }

export function authenticated() { return { type: AUTHENTICATED }; }
export function unauthenticated() { return { type: UNAUTHENTICATED }; }

export function apiKeyListRequest(){ return { type: API_KEY_LIST_REQUEST }; }
export function apiKeyListSuccess(applications) { return { type: API_KEY_LIST_SUCCESS, applications }; }
export function apiKeyListError(error) { return { type: API_KEY_LIST_ERROR, error }; }

export function createTokenSuccess(token) { return { type: CREATE_TOKEN_SUCCESS, token }; }
export function createTokenError(error) { return { type: CREATE_TOKEN_ERROR, error }; }

export function revokeTokenSuccess(token) { return { type: REVOKE_TOKEN_SUCCESS, token }; }
export function revokeTokenError(error) { return { type: REVOKE_TOKEN_ERROR, error }; }

export function loginLocalUser(data) {
  return function (dispatch) {
    dispatch(loginRequest());

    let uri = '/api/login/local';

    axios.post(uri, data)
      .then(function (response) {
        let token = '12345';

        localStorage.setItem('token', token);

        dispatch(loginSuccess({
          userId: response.data,
          token: token,
          profile: {
            email: response.data
          }
        }));
      })
      .catch(function (error) {
        dispatch(loginError(error.response.data.error || "Something went wrong with the login. Please try again-"));
      });
  };
}

export function initCurrentUser() {
  return function (dispatch) {

    axios.get('/api/me')
      .then(function (response) {
        let {id, deposit_groups} = response.data;

        localStorage.setItem('token', id);
        dispatch(loginSuccess({
          userId: id,
          token: id,
          profile: response.data,
          depositGroups: deposit_groups
        }));

      })
      .catch(function () {
        dispatch(clearAuth());
      });
  };
}


export function clearAuth() {
  return function (dispatch) {
    dispatch(logoutRequest());
    localStorage.clear();
    dispatch(logoutSuccess());
  };
}

export function logout() {
  return function (dispatch) {
    dispatch(logoutRequest());

    axios.get('/api/logout')
      .then(function () {
        localStorage.clear();
        dispatch(logoutSuccess());
      });
  };
}


export function getUsersAPIKeys() {
  return function (dispatch) {
    dispatch(apiKeyListRequest());
    axios.get('/api/applications/')
      .then(function (response) {
        dispatch(apiKeyListSuccess(response.data));
      })
      .catch(function (error) {
        dispatch(apiKeyListError(error));
      });
  };
}

export function createToken(data) {
  return function (dispatch) {
    // dispatch(apiKeyListRequest());
    axios.post('/api/applications/tokens/new/', data)
      .then(function (response) {
        dispatch(createTokenSuccess(response.data));
      })
      .catch(function (error) {
        dispatch(createTokenError(error));
      });
  };
}


export function revokeToken(token_id, key) {
  return function (dispatch) {
    // dispatch(apiKeyListRequest());
    axios.get(`/api/applications/tokens/${token_id}/revoke/`)
      .then(function () {
        dispatch(revokeTokenSuccess(key));
      })
      .catch(function (error) {
        dispatch(revokeTokenError(error));
      });
  };
}


export function createApplication() {
  return function (dispatch) {
    // dispatch(apiKeyListRequest());
    axios.get('/api/applications/')
      .then(function (response) {
        dispatch(apiKeyListSuccess(response.data));
      })
      .catch(function (error) {
        dispatch(apiKeyListError(error));
      });
  };
}

