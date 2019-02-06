import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import search from "./searchReducer";
import auth from "./authReducer";
import drafts from "./drafts";
import published from "./published";
import users from "./users";
import dashboard from "./dashboard";
import workflows from "./workflows";

const rootReducer = combineReducers({
  auth,
  users,
  drafts,
  dashboard,
  search,
  published,
  workflows,
  routing: routerReducer
});

export default rootReducer;
