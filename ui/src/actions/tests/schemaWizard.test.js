import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../schemaWizard";
import axios from "axios";
import { Map } from "immutable";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Action Creators => schemaWizard", () => {
  it("Sync Action Creators ", () => {
    const error = {};
    const id = "";
    const data = {};
    const items = {};
    const path = "";
    const errors = {
      type: actions.SCHEMA_ERROR,
      payload: error
    };
    const init = {
      type: actions.SCHEMA_INIT,
      id,
      data
    };
    const update = {
      type: actions.LIST_UPDATE,
      items
    };
    const enable = {
      type: actions.CREATE_MODE_ENABLE
    };
    const select = {
      type: actions.PROPERTY_SELECT,
      path
    };

    expect(actions.schemaError(error)).toEqual(errors);
    expect(actions.schemaInit(id, data)).toEqual(init);
    expect(actions.listUpdate(items)).toEqual(update);
    expect(actions.enableCreateMode()).toEqual(enable);
    expect(actions.selectProperty(path)).toEqual(select);
  });
});
