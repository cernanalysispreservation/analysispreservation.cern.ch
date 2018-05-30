import { Map } from 'immutable';

import {
  PUBLISHED_REQUEST,
  PUBLISHED_SUCCESS,
  PUBLISHED_ERROR,
  PUBLISHED_ITEM_REQUEST,
  PUBLISHED_ITEM_SUCCESS,
  PUBLISHED_ITEM_ERROR,
} from '../actions/published';

const initialState = Map({
  results: {},
  loading: false,
  error: null,
  current_item: Map({
    id: null,
    data: null,
    loading: false,
    error: null
  })
});
// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function publishedReducer(state = initialState, action) {
  switch (action.type) {
    case PUBLISHED_REQUEST:
      return state;
    case PUBLISHED_SUCCESS:
      return state;
    case PUBLISHED_ERROR:
      return state;
    case PUBLISHED_ITEM_REQUEST:
      return state.setIn(['current_item', 'loading'], true);
    case PUBLISHED_ITEM_SUCCESS:
      return state
              .setIn(['current_item', 'loading'], false)
              .setIn(['current_item', 'data'], action.published);
    case PUBLISHED_ITEM_ERROR:
      return state
              .setIn(['current_item', 'loading'], false)
              .setIn(['current_item', 'error'], action.error);
    default:
      return state;
  }
}
