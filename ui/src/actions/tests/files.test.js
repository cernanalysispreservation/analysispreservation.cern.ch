import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../files";
import axios from "axios";
import { Map } from "immutable";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Actions Creators => Files ", () => {
  it("Sync Bucket Item", () => {
    const bucket = {};
    const error = {};
    const request = {
      type: actions.BUCKET_ITEM_REQUEST
    };

    const success = {
      type: actions.BUCKET_ITEM_SUCCESS,
      bucket
    };

    const errors = {
      type: actions.BUCKET_ITEM_ERROR,
      error
    };

    expect(actions.bucketItemRequest()).toEqual(request);
    expect(actions.bucketItemSuccess(bucket)).toEqual(success);
    expect(actions.bucketItemError(error)).toEqual(errors);
  });

  it("Sync Upload File", () => {
    const filename = "";
    const data = {};
    const error = {};
    const request = {
      type: actions.UPLOAD_FILE_REQUEST,
      filename
    };
    const success = {
      type: actions.UPLOAD_FILE_SUCCESS,
      filename,
      data
    };

    const actionSuccess = {
      type: actions.UPLOAD_ACTION_SUCCESS,
      filename
    };

    const errors = {
      type: actions.UPLOAD_FILE_ERROR,
      filename,
      error
    };

    expect(actions.uploadFileRequest(filename)).toEqual(request);
    expect(actions.uploadFileSuccess(filename, data)).toEqual(success);
    expect(actions.uploadFileError(filename, error)).toEqual(errors);
    expect(actions.uploadActionSuccess(filename)).toEqual(actionSuccess);
  });

  it("Sync Delete File", () => {
    const filename = "";
    const error = {};
    const request = {
      type: actions.DELETE_FILE_REQUEST,
      filename
    };
    const success = {
      type: actions.DELETE_FILE_SUCCESS,
      filename
    };

    const errors = {
      type: actions.DELETE_FILE_ERROR,
      filename,
      error
    };

    expect(actions.deleteFileRequest(filename)).toEqual(request);
    expect(actions.deleteFileSuccess(filename)).toEqual(success);
    expect(actions.deleteFileError(filename, error)).toEqual(errors);
  });

  it("Async DeleteFileByUri", async () => {
    const uri = "www.www.www";
    const filename = "filename";

    const expectedActions = [
      { type: actions.DELETE_FILE_REQUEST, filename },
      { type: actions.DELETE_FILE_SUCCESS, filename }
    ];

    axios.delete = jest.fn(url => {
      return Promise.resolve({});
    });

    const store = mockStore({});

    await store.dispatch(actions.deleteFileByUri(uri, filename)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
