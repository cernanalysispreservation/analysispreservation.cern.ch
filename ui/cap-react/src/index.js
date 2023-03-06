/* eslint-disable import/default */

import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import store, { history } from "./store/configureStore";
import Root from "./antd/Root";
import * as Sentry from "@sentry/react";

import "./styles/styles.scss"; // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
// require('./favicon.ico'); // Tell webpack to load favicon.ico

import "grommet/scss/hpinc/index.scss";

if (process.env.SENTRY_UI_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_UI_DSN });
}

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById("app")
);

if (module.hot) {
  module.hot.accept("./antd/Root", () => {
    const NewRoot = require("./antd/Root").default;
    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById("app")
    );
  });
}
