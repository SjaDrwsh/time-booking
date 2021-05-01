'use strict';

module.exports = {
  rootDir: '..',
  moduleDirectories: ['node_modules', '..'],
  restoreMocks: true,
  // Coverage
  coverageDirectory: 'artifacts/coverage',
  collectCoverage: false,
  collectCoverageFrom: ['**/*.ts?(x)'],
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        outputPath: 'artifacts/test/test-report.html',
      },
    ],
  ],
  coverageReporters: ['text', 'lcov', 'text-summary', 'json-summary'],
  coveragePathIgnorePatterns: [
    '<rootDir>/bin/',
    '<rootDir>/coverage/',
    '<rootDir>/config/',
    '<rootDir>/docs',
    '<rootDir>/helm-chart/',
    '<rootDir>/src/type',
    '<rootDir>/node_modules/',
    '<rootDir>/public/',
    '<rootDir>/stories/',
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
