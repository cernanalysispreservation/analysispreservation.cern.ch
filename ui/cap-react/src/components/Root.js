import React, { Component } from "react";
import PropTypes from "prop-types";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import App from "../antd/App";
import PiwikReactRouter from "piwik-react-router";

export const piwik =
  process.env.PIWIK_URL && process.env.PIWIK_SITEID
    ? PiwikReactRouter({
        url: process.env.PIWIK_URL,
        siteId: process.env.PIWIK_SITEID
      })
    : null;

export default class Root extends Component {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter
          history={piwik ? piwik.connectToHistory(history) : history}
        >
          <App />
        </ConnectedRouter>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
