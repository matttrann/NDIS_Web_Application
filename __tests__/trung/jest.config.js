const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/(.*)$': '<rootDir>/$1',
    // Mock problematic modules to avoid ESM issues
    '@/env.mjs': '<rootDir>/__tests__/trung/mocks/env.mock.js',
    // Mock other problematic imports
    'next/font/(.*)': '<rootDir>/__tests__/matt/mocks/fonts.mock.js',
    'assets/fonts': '<rootDir>/__tests__/matt/mocks/fonts.mock.js'
  },
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', { configFile: './.babelrc.test' }]
  },
  transformIgnorePatterns: [
    // Transform ES modules in node_modules
    '/node_modules/(?!(@t3-oss|stripe|next)/)'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mjs']
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 