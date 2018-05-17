import {createStore, compose, applyMiddleware} from 'redux';
// import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
// import { browserHistory } from 'history';

import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
// 'routerMiddleware': the new way of storing route changes with redux middleware since rrV4.
import { routerMiddleware } from 'react-router-redux';

import {createLogger} from 'redux-logger';

import rootReducer from '../reducers';

export const history = createHistory();

function configureStoreProd(initialState) {
  const reactRouterMiddleware = routerMiddleware(history);
  const middlewares = [
    // Add other middleware on this line...

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    reactRouterMiddleware,
    thunk,
  ];

  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares)
    )
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

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(...middlewares)
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;
const store = configureStore();

export default store;
