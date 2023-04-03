import { createStore, compose, applyMiddleware } from "redux";
// import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from "redux-thunk";

import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";

import rootReducer from "../reducers";

export const history = createBrowserHistory();

function configureStoreProd(initialState) {
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares = [
    // Add other middleware on this line...

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    reactRouterMiddleware,
    thunk,
  ];

  const store = createStore(
    rootReducer(history),
    initialState,
    compose(applyMiddleware(...middlewares))
  );

  return store;
}

function configureStoreDev(initialState) {
  const reactRouterMiddleware = routerMiddleware(history);
  const loggerMiddleware = createLogger();

  const middlewares = [
    // Add other middleware on this line...

    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    // **REMARK_BY_PAM not needed if using ImmutableJS
    // TOFIX remove libbrary dependency
    // reduxImmutableStateInvariant(),

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    reactRouterMiddleware,
    thunk,
    loggerMiddleware,
  ];

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  const store = createStore(
    rootReducer(history),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  return store;
}

const configureStore =
  process.env.NODE_ENV === "production"
    ? configureStoreProd
    : configureStoreDev;
const store = configureStore();

export default store;
