'use strict';

module.exports = {
  rootDir: '..',
  moduleDirectories: ['node_modules', '..'],
  restoreMocks: true,
  // Coverage
  coverageDirectory: 'artifacts/coverage',
  collectCoverage: false,
  collectCoverageFrom: ['**/*.ts?(x)'],
  coverageReporters: ['text', 'lcov', 'text-summary', 'json-summary'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/public/',
  ],
  // Fixes console statements not appearing in watch mode
  // https://github.com/facebook/jest/issues/2441
  verbose: false,
  setupFiles: [
    '<rootDir>/config/polyfills.js',
    'jest-localstorage-mock',
    '<rootDir>/config/jest/enzymeAdapter.js',
    '<rootDir>/config/jest/globalSetup.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/config/jest/jestSetup.ts'],
  testMatch: ['**/*.test.ts?(x)'],
  testEnvironment: '<rootDir>/config/jest/testEnvironment.js',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  testURL: 'http://localhost/#/',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
