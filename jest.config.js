const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  rootDir: './',
  moduleNameMapper: {
    '^@pages/(.*)$': '<rootDir>/pages/$1',
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@styles/(.*)$': '<rootDir>/styles/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^__mock__/(.*)$': '<rootDir>/__mock__/$1',
  },
  testEnvironment: 'jsdom',
  resetMocks: false,
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    '<rootDir>/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/*.config.js',
  ],
};

module.exports = createJestConfig(customJestConfig);
