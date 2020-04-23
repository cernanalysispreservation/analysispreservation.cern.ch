import { addDecorator, configure } from "@storybook/react";
import { addReadme } from "storybook-readme";
import "../src/styles/styles.scss";
import "grommet/scss/hpinc/index.scss";

addDecorator(addReadme);

const req = require.context("../src/", true, /\.stories.js$/);

function loadStories() {
  // require('../stories/index.js');
  req.keys().forEach(filename => req(filename));
  // You can require as many stories as you need.
}

configure(loadStories, module);
