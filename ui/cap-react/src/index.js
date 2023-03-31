/* eslint-disable import/default */

import React from "react";
import { createRoot } from "react-dom/client";
import { AppContainer } from "react-hot-loader";
import store, { history } from "./store/configureStore";
import Root from "./antd/Root";
import * as Sentry from "@sentry/react";

import "./styles/styles.scss";

if (process.env.SENTRY_UI_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_UI_DSN });
}

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>
)
