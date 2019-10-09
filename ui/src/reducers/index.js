import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import search from "./searchReducer";
import auth from "./authReducer";
import draftItem from "./draftItem";
import published from "./published";
import users from "./users";
import dashboard from "./dashboard";
import workflows from "./workflows";
import status from "./status";

const rootReducer = combineReducers({
  auth,
  users,
  draftItem,
  dashboard,
  search,
  published,
  workflows,
  status,
  routing: routerReducer
});

export default rootReducer;
