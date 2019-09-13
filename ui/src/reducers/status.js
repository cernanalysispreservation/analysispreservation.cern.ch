import { Map } from "immutable";

import {
  FETCH_SERVICES_SUCCESS,
  FETCH_SERVICES_ERROR,
  FETCH_SERVICES_REQUEST
} from "../actions/status";

const initialState = Map({
  loading: false,
  error: null,
  services: [{}]
});

export default function statusReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SERVICES_REQUEST:
      return state.set("loading", true).set("error", null);
    case FETCH_SERVICES_ERROR:
      return state.set("loading", false).set("error", action.error);
    case FETCH_SERVICES_SUCCESS:
      return state.set("services", action.payload);
    default:
      return state;
  }
}
