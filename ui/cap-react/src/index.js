import React from "react";
import { createRoot } from "react-dom/client";
import store, { history } from "./store/configureStore";
import Root from "./antd/Root";
import * as Sentry from "@sentry/react";

import "antd/dist/reset.css"
import "./style.css";

if (process.env.SENTRY_UI_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_UI_DSN });
}

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <Root store={store} history={history} />
)
