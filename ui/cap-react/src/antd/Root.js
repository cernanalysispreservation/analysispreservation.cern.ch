import React from "react";
import PropTypes from "prop-types";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import App from "../antd/App";
import { ConfigProvider } from "antd"
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

const PRIMARY_COLOR = "#006996";

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
          <ConfigProvider theme={{
            token: {
              colorPrimary: PRIMARY_COLOR,
              colorLink: PRIMARY_COLOR,
              colorLinkHover: "#1a7fa3",
              borderRadius: 2,
              colorBgLayout: "#f0f2f5",
              fontFamily: "Titillium Web",
            },
          }}>
            <App />
          </ConfigProvider>
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
