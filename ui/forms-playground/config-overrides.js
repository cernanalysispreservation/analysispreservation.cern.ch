// config-overrides.js
// see: https://github.com/timarney/react-app-rewired

const path = require("path");
const fs = require("fs");

const rewireBabelLoader = require("react-app-rewire-babel-loader");

// helpers
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const rewireSass = require("react-app-rewire-scss");

module.exports = function override(config, env) {
  config = rewireBabelLoader.include(config, resolveApp("../cap-react"));
  return config;
};
