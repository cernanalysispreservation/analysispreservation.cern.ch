import * as actions from "../../actions/published";
import publishedReducer from "../published";

import {
  initialState,
  loadingState,
  publishedSuccessPayload,
  publishedSuccessState,
  ERROR,
  errorState,
  reviewErrorState,
  reviewSuccessState,
  REVIEW
} from "./utils/publishedReducer";

describe("Published Reducer Suite", () => {
  it("Init state", () => {
    const action = {
      type: actions.INIT_STATE
    };
    expect(publishedReducer(initialState, action)).toEqual(initialState);
  });

  it("Publish Item Request", () => {
    const action = {
      type: actions.PUBLISHED_ITEM_REQUEST
    };
    expect(publishedReducer(initialState, action)).toEqual(loadingState);
  });

  it("Publish Item Success", () => {
    const action = {
      type: actions.PUBLISHED_ITEM_SUCCESS,
      published: publishedSuccessPayload
    };

    expect(publishedReducer(loadingState, action)).toEqual(
      publishedSuccessState
    );
  });

  it("Published Item Error", () => {
    const action = {
      type: actions.PUBLISHED_ITEM_ERROR,
      error: ERROR
    };

    expect(publishedReducer(loadingState, action)).toEqual(errorState);
  });

  it("Review Publish Request", () => {
    const action = {
      type: actions.REVIEW_PUBISHED_REQUEST
    };
    // In order to review a published item it has to be published first
    // therefore there is no meaning to compare it with the initialState
    // to avoid copying all the state again we just simply update the loading
    const state = publishedSuccessState.set("reviewLoading", true);
    expect(publishedReducer(publishedSuccessState, action)).toEqual(state);
  });
  it("Review Publish Error", () => {
    const action = {
      type: actions.REVIEW_PUBISHED_ERROR,
      error: ERROR
    };

    expect(publishedReducer(publishedSuccessState, action)).toEqual(
      reviewErrorState
    );
  });

  it("Review Publish Success", () => {
    const action = {
      type: actions.REVIEW_PUBISHED_SUCCESS,
      payload: { review: REVIEW }
    };

    expect(publishedReducer(publishedSuccessState, action)).toEqual(
      reviewSuccessState
    );
  });
});
