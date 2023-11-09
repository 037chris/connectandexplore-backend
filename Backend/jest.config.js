/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  reporters: ["default", "jest-junit"],
  testMatch: ["**/*.test.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  jest: {
    testTimeout: 120000, // Set the timeout in milliseconds
  },
};
