/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/styleMock.js',
  },
  transform: {
    '^.+\\.ts?$': ['ts-jest', { useESM: true }],
    '^.+\\.js?$': 'babel-jest',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testRunner: 'jest-circus/runner',
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
}
