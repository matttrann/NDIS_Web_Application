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
    '@/env.mjs': '<rootDir>/__tests__/matt/mocks/env.mock.js',
    '@/lib/stripe': '<rootDir>/__tests__/matt/mocks/stripe.mock.js',
    '@/lib/db': '<rootDir>/__tests__/matt/mocks/db.mock.js',
    '@/auth': '<rootDir>/__tests__/matt/mocks/auth.mock.js',
    '@/config/subscriptions': '<rootDir>/__tests__/matt/mocks/subscriptions.mock.js',
    '@/lib/subscription': '<rootDir>/__tests__/matt/mocks/subscription.mock.js',
    '@/actions/generate-user-stripe': '<rootDir>/__tests__/matt/mocks/generate-user-stripe.mock.js',
    '@/app/api/webhooks/stripe/route': '<rootDir>/__tests__/matt/mocks/stripe-webhook.mock.js',
    // Mock the fonts module
    'assets/fonts': '<rootDir>/__tests__/matt/mocks/fonts.mock.js',
    'next/font/(.*)': '<rootDir>/__tests__/matt/mocks/fonts.mock.js'
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/cypress/'
  ],
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'], configFile: './.babelrc.test' }],
  },
  transformIgnorePatterns: [
    // Transform ES modules in node_modules
    '/node_modules/(?!(@t3-oss|stripe|next)/)'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/public/**',
    '!**/cypress/**',
    '!jest.config.js',
    '!next.config.js',
    '!postcss.config.js',
    '!tailwind.config.js',
    '!**/stories/**',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 