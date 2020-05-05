import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "cap-react/src/store/configureStore";
import * as serviceWorker from "./serviceWorker";
import Grommet from "grommet/components/Grommet";

import "cap-react/src/styles/styles.scss";
import "grommet/scss/hpinc/index.scss";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Grommet>
        <App />
      </Grommet>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
