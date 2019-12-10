import publishedReducer from "../published";
import * as common from "../../actions/common";
import * as actions from "../../actions/published";
import { Map } from "immutable";

const schema = {
  schema: {},
  uiSchema: {}
};
const error = {};
const published = {
  files: Map({})
};
const initialState = Map({
  id: null,
  data: null,
  schema: null,
  uiSchema: null,
  loading: false,
  error: null,
  files: Map({})
});
const updatedState = Map({
  id: null,
  data: null,
  schema: null,
  uiSchema: null,
  loading: false,
  error: null,
  files: Map({})
});
const errorState = Map({
  id: null,
  data: null,
  schema: null,
  uiSchema: null,
  loading: false,
  error: error,
  files: Map({})
});
const successState = Map({
  id: null,
  data: null,
  schema: schema.schema,
  uiSchema: schema.uiSchema,
  loading: false,
  error: null,
  files: Map({})
});
const loadingState = Map({
  id: null,
  data: null,
  schema: null,
  uiSchema: null,
  loading: true,
  error: false,
  files: Map({})
});

describe("publishedReducer Reduccers Test", () => {
  it("Should Return the initial state", () => {
    expect(publishedReducer(undefined, {})).toEqual(initialState);
  });

  it("Fetch Schema Request", () => {
    const action = {
      type: common.FETCH_SCHEMA_REQUEST
    };

    expect(publishedReducer(initialState, action)).toEqual(loadingState);
  });

  it("Fetch Schema Succcess", () => {
    const action = {
      type: common.FETCH_SCHEMA_SUCCESS,
      schema
    };

    expect(publishedReducer(initialState, action)).toEqual(successState);
  });

  it("Fetch Schema Error", () => {
    const action = {
      type: common.FETCH_SCHEMA_ERROR,
      error
    };

    expect(publishedReducer(initialState, action)).toEqual(errorState);
  });

  it("Published item request", () => {
    const action = {
      type: actions.PUBLISHED_ITEM_REQUEST
    };

    expect(publishedReducer(initialState, action)).toEqual(loadingState);
  });

  it("Published Item Success", () => {
    const action = {
      type: actions.PUBLISHED_ITEM_SUCCESS,
      published
    };

    expect(publishedReducer(initialState, action)).toEqual(updatedState);
  });

  it("Published Item Error", () => {
    const action = {
      type: actions.PUBLISHED_ITEM_ERROR,
      error
    };

    expect(publishedReducer(initialState, action)).toEqual(errorState);
  });
});
