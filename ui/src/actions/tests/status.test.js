import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../status";
import axios from "axios";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Actions => Status", () => {
  it("Sync Fetch Request", () => {
    const action = {
      type: actions.FETCH_SERVICES_REQUEST
    };

    expect(actions.fetchServicesRequest()).toEqual(action);
  });

  it("Sync Fetch Success", () => {
    const services = [];
    const action = {
      type: actions.FETCH_SERVICES_SUCCESS,
      payload: services
    };

    expect(actions.fetchServicesSuccess(services)).toEqual(action);
  });

  it("Sync Fetch Error", () => {
    const error = {};
    const action = {
      type: actions.FETCH_SERVICES_ERROR,
      error
    };

    expect(actions.fetchServicesError(error)).toEqual(action);
  });

  it("Async Fetch Services", async () => {
    const services = [];
    const expectedActions = [
      { type: actions.FETCH_SERVICES_REQUEST },
      { type: actions.FETCH_SERVICES_SUCCESS, payload: services }
    ];

    axios.get = jest.fn(url => {
      return Promise.resolve({
        data: services
      });
    });
    const store = mockStore({});

    await store.dispatch(actions.fetchServicesStatus()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
