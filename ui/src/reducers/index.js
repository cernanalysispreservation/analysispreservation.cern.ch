import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import search from "./searchReducer";
import auth from "./authReducer";
import draftItem from "./draftItem";
import published from "./published";
import users from "./users";
import dashboard from "./dashboard";
import workflows from "./workflows";
import status from "./status";

const rootReducer = history =>
  combineReducers({
    auth,
    users,
    draftItem,
    dashboard,
    search,
    published,
    workflows,
    status,
    routing: connectRouter(history),
    router: connectRouter(history)
  });

export default rootReducer;
