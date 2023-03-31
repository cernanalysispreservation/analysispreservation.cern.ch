import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import dotenv from "dotenv";
import theme from "./src/antd/theme";
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const env = dotenv.config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

export default {
  resolve: {
    extensions: ["*", ".js", ".jsx", ".json"],
  },
  devtool: "eval-cheap-module-source-map", // more info:https://webpack.js.org/guides/development/#using-source-maps and https://webpack.js.org/configuration/devtool/
  entry: [
    // must be first entry to properly set public path
    "./src/webpack-public-path",
    "react-hot-loader/patch",
    "webpack-hot-middleware/client?reload=true",
    path.resolve(__dirname, "src/index.js"), // Defining path seems necessary for this to work consistently on Windows machines.
  ],
  mode: "development",
  output: {
    publicPath: "/",
    filename: "bundle.js",
    crossOriginLoading: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"), // Tells React to build in either dev or prod modes. https://facebook.github.io/react/downloads.html (See bottom)
      __DEV__: true,
      ...envKeys,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      // Create HTML file that includes references to bundled CSS and JS.
      template: "src/index.ejs",
      favicon: "src/favicon.ico",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      inject: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /.m?js$/, // TODO: remove after React, dnd, etc are updated to the newest versions and see if it works
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(jpe?g|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
        type: "asset",
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              // If you are using less-loader@5 please spread the lessOptions to options directly
              modifyVars: theme,
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /(\.css|\.scss|\.sass)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("autoprefixer")],
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: [
                "./node_modules",
                "../node_modules",
                path.resolve(__dirname, "src", "scss"),
              ],
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
