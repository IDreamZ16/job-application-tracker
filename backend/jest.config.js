module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/load-env.js"],
  globalSetup: "<rootDir>/tests/global-setup.js",
  testMatch: ["**/tests/**/*.test.js"],
  testTimeout: 10000,
};
