import {Map, List, fromJS} from 'immutable';

import {
  AUTHENTICATED,
  UNAUTHENTICATED,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGIN_ERROR,

  API_KEY_LIST_SUCCESS,
  API_KEY_LIST_ERROR,
  CREATE_TOKEN_SUCCESS,
  CREATE_TOKEN_ERROR,
  REVOKE_TOKEN_SUCCESS
} from '../actions/auth';

const initialState = Map({
  isLoggedIn: false,
  currentUser: Map({}),
  token: localStorage.getItem('token'),
  error: null,
  loading: false,
  tokens: List()
});
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATED:
      return state.set('isLoggedIn', true);
    case UNAUTHENTICATED:
      return state.set('isLoggedIn', false);
    case LOGIN_REQUEST:
      return state.set('loading', true);
    case LOGIN_SUCCESS:
      return state
        .set('isLoggedIn', true)
        .set('currentUser', fromJS(action.user))
        .set('loading', false);
    case LOGOUT_REQUEST:
      return state.set('loading', true);
    case LOGOUT_SUCCESS:
      return state
        .set('isLoggedIn', false)
        .set('currentUser', null)
        .set('loading', false);
    case LOGIN_ERROR:
      return state;
    case API_KEY_LIST_SUCCESS:
      return state
        .set('tokens', List(action.applications.tokens));
    case API_KEY_LIST_ERROR:
    case CREATE_TOKEN_SUCCESS:
      return state
        .setIn(['tokens', action.token.t_id], action.token);
    case CREATE_TOKEN_ERROR:
      return state
        .setIn(['tokens', 'error'], action.error);
    case REVOKE_TOKEN_SUCCESS:
      return state
        .deleteIn(['tokens', action.token]);
    // case REVOKE_TOKEN_ERROR:
    //   return state
    default:
      return state;
  }
}
