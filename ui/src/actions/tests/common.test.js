import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../common";
import axios from "axios";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Action Creator => Common", () => {
  it("Sync Fetch Schema Request", () => {
    const action = {
      type: actions.FETCH_SCHEMA_REQUEST
    };

    expect(actions.fetchSchemaRequest()).toEqual(action);
  });

  it("Sync Fetch Schema Success", () => {
    const schema = {};
    const action = {
      type: actions.FETCH_SCHEMA_SUCCESS,
      schema
    };

    expect(actions.fetchSchemaSuccess(schema)).toEqual(action);
  });

  it("Sync Fetch Schema Error", () => {
    const error = {};
    const action = {
      type: actions.FETCH_SCHEMA_ERROR,
      error
    };

    expect(actions.fetchSchemaError(error)).toEqual(action);
  });
});
