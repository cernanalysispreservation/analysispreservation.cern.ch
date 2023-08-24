import PropTypes from "prop-types";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import App from "../antd/App";
import { ConfigProvider } from "antd";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";
import { theme } from "./utils/theme";

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
          <ConfigProvider theme={theme}>
            <App />
          </ConfigProvider>
        </ConnectedRouter>
      </MatomoProvider>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;
