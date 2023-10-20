import { Map, fromJS } from "immutable";

import {
  UPDATE_SCHEMA_CONFIG,
  UPDATE_NOTIFICATION_BY_INDEX,
  UPDATE_NOTIFICATIONS,
  REMOVE_NOTIFICATION,
  CREATE_NOTIFICATION_GROUP,
  SET_SCHEMA_LOADING,
} from "../actions/builder";

const initialState = Map({
  initialConfig: {},
  config: Map({}),
  loading: false,
});

export default function schemaReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SCHEMA_LOADING:
      return state.set("loading", action.value);
    case UPDATE_SCHEMA_CONFIG:
      return state.set("config", fromJS(action.config));
    case UPDATE_NOTIFICATION_BY_INDEX:
      return state.setIn(action.payload.path, action.payload.value);
    case UPDATE_NOTIFICATIONS:
      return state.setIn(action.payload.path, action.payload.value);
    case REMOVE_NOTIFICATION:
      return state.setIn(action.payload.path, action.payload.notification);
    case CREATE_NOTIFICATION_GROUP:
      return state.setIn(action.path, []);
    default:
      return state;
  }
}
