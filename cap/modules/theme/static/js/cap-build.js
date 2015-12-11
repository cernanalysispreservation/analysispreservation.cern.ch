({
  preserveLicenseComments: false,
  optimize: 'uglify2',
  uglify2: {
    output: {
      beautify: false,
      comments: false
    },
    compress: {
      drop_console: true,
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true
    },
    warnings: true,
    mangle: true
  },
  mainConfigFile: './cap-settings.js',
})


