// config-overrides.js
// see: https://github.com/timarney/react-app-rewired

const path = require("path");
const fs = require("fs");

const {
  override,
  addBabelPresets,
  addBabelPlugins,
  addWebpackModuleRule,
  addExternalBabelPlugins,
  babelInclude
} = require("customize-cra");

// helpers
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = override(
  addWebpackModuleRule({
    test: /(\.css|\.scss|\.sass)$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          sourceMap: true
        }
      },
      {
        loader: "postcss-loader",
        options: {
          plugins: () => [require("autoprefixer")],
          sourceMap: true
        }
      },
      {
        loader: "sass-loader",
        options: {
          includePaths: [
            "./node_modules",
            "../node_modules",
            path.resolve(__dirname, "src", "scss")
          ],
          sourceMap: true
        }
      }
    ]
  }),
  babelInclude([path.resolve("src"), path.resolve("../cap-react")])
);
