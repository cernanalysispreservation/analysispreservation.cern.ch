const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "4mpnou",
  video: false,
  downloadsFolder: "cypress/downloads",
  viewportHeight: 1300,
  viewportWidth: 1800,
  watchForFileChanges: false,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    experimentalRunAllSpecs: true,
  },
});
