const path = require("path");
// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  const extraRules = [
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    },
    {
      test: /\.scss$/,
      use: [
        {
          loader: "style-loader" // creates style nodes from JS strings
        },
        {
          loader: "css-loader" // translates CSS into CommonJS
        },
        {
          loader: "sass-loader" // compiles Sass to CSS
        },
        {
          loader: "sass-loader",
          options: {
            includePaths: [
              "../../node_modules",
              "../node_modules",
              "../../node_modules/grommet/node_modules",
              "../node_modules/grommet/node_modules"
            ]
          }
        }
      ]
    }
  ];
  config.module.rules.push(...extraRules);
  // hook for the loaders
  config.module.rules.push({
    test: /\.stories\.jsx?$/,
    loaders: [require.resolve("@storybook/source-loader")],
    enforce: "pre"
  });

  // Return the altered config
  return config;
};
