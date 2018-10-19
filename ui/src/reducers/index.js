import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import search from "./searchReducer";
import auth from "./authReducer";
import drafts from "./drafts";
import published from "./published";
import users from "./users";
import dashboard from "./dashboard";

const rootReducer = combineReducers({
  auth,
  users,
  drafts,
  dashboard,
  search,
  published,
  routing: routerReducer
});

export default rootReducer;
