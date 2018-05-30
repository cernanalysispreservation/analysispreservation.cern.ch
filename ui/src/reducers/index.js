import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import search from './searchReducer';
import auth from './authReducer';
import drafts from './drafts';
import published from './published';

const rootReducer = combineReducers({
  auth,
  drafts,
  search,
  published,
  routing: routerReducer
});

export default rootReducer;
