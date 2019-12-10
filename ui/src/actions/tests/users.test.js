import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../users";
import axios from "axios";
import { Map } from "immutable";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Actions Creators => Users", () => {
  it("Sync Action Creators", () => {
    const users = {};
    const error = {};
    const request = {
      type: actions.USERS_ITEM_REQUEST
    };
    const success = {
      type: actions.USERS_ITEM_SUCCESS,
      users
    };
    const errors = {
      type: actions.USERS_ITEM_ERROR,
      error
    };

    expect(actions.usersItemRequest()).toEqual(request);
    expect(actions.usersItemSuccess(users)).toEqual(success);
    expect(actions.usersItemError(error)).toEqual(errors);
  });

  it("Async GetUsers", () => {});
});
