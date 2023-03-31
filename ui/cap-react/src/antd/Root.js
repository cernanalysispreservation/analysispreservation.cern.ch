import React from "react";
import PropTypes from "prop-types";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import App from "../antd/App";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

export const matomoInstance =
  process.env.PIWIK_URL && process.env.PIWIK_SITEID
    ? createInstance({
        urlBase: process.env.PIWIK_URL,
        siteId: process.env.PIWIK_SITEID,
      })
    : null;

const Root = ({ store, history }) => {
  return (
    <Provider store={store}>
      <MatomoProvider value={matomoInstance}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </MatomoProvider>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;
