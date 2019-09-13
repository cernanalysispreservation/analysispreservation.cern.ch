import { configure } from "@storybook/react";
import "../src/styles/styles.scss";
import "grommet/scss/hpinc/index.scss";

const req = require.context("../src/", true, /\.stories.js$/);

function loadStories() {
  // require('../stories/index.js');
  req.keys().forEach(filename => req(filename));
  // You can require as many stories as you need.
}

configure(loadStories, module);
