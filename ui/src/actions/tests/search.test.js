import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actions from "../search";
import axios from "axios";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Actions => Search", () => {
  it("Sync Search Request", () => {
    const action = {
      type: actions.SEARCH_REQUEST
    };

    expect(actions.searchRequest()).toEqual(action);
  });

  it("Sync Search Success", () => {
    const results = [];
    const action = {
      type: actions.SEARCH_SUCCESS,
      results
    };

    expect(actions.searchSuccess(results)).toEqual(action);
  });

  it("Sync Search Error", () => {
    const error = {};
    const action = {
      type: actions.SEARCH_ERROR,
      error
    };

    expect(actions.searchError(error)).toEqual(action);
  });

  it("Async Fetch Search", async () => {
    const pathname = "/search";
    const location_search = "?q=xax";

    const results = {
      aggregations: {
        facet_cadi_status: {},
        facet_cms_working_group: {},
        facet_publication_status: {},
        facet_type: {},
        particles: {}
      },
      links: {
        self:
          "http://localhost:3000/records/?sort=mostrecent&q=xax&page=1&size=10"
      },
      hits: {
        total: 1,
        hits: [{}]
      }
    };

    const expectedActions = [
      { type: actions.ADD_AGGS, selectedAggs: { q: "xax" } },
      { type: actions.SEARCH_REQUEST },
      { type: actions.SEARCH_SUCCESS, results }
    ];

    axios.get = jest.fn(url => {
      return Promise.resolve({
        data: results
      });
    });

    const store = mockStore({});

    await store
      .dispatch(actions.fetchSearch(pathname, location_search))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });
});
