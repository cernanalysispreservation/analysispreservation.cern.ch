import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import search from "./searchReducer";
import auth from "./authReducer";
import draftItem from "./draftItem";
import published from "./published";
import dashboard from "./dashboard";
import workflows from "./workflows";
import status from "./status";
import schemaWizard from "./schemaWizard";
import collection from "./collection";

const rootReducer = history =>
  combineReducers({
    auth,
    draftItem,
    dashboard,
    search,
    published,
    workflows,
    status,
    schemaWizard,
    collection,
    router: connectRouter(history)
  });

export default rootReducer;
