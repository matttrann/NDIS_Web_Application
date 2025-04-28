const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@t3-oss/env-nextjs$': '<rootDir>/__tests__/Jamie/testenv/env-nextjs.js',
    '^next-auth/react$': '<rootDir>/__tests__/rezah/mocks/next-auth-react.js',
    // Mock problematic modules to avoid ESM issues
    '@/env.mjs': '<rootDir>/__tests__/matt/mocks/env.mock.js',
    '@/lib/stripe': '<rootDir>/__tests__/matt/mocks/stripe.mock.js',
    '@/lib/db': '<rootDir>/__tests__/matt/mocks/db.mock.js',
    '@/auth': '<rootDir>/__tests__/matt/mocks/auth.mock.js',
    '@/config/subscriptions': {
      "__tests__/grant/": '<rootDir>/__tests__/grant/mocks/subscriptions.mock.js', 
      "__tests__/matt/": '<rootDir>/__tests__/matt/mocks/subscriptions.mock.js',
      "default": '<rootDir>/__tests__/matt/mocks/subscriptions.mock.js'
    },
    '@/lib/subscription': '<rootDir>/__tests__/matt/mocks/subscription.mock.js',
    '@/actions/generate-user-stripe': '<rootDir>/__tests__/matt/mocks/generate-user-stripe.mock.js',
    '@/app/api/webhooks/stripe/route': '<rootDir>/__tests__/matt/mocks/stripe-webhook.mock.js',
    // Mock the fonts module
    'assets/fonts': '<rootDir>/__tests__/matt/mocks/fonts.mock.js',
    'next/font/(.*)': '<rootDir>/__tests__/matt/mocks/fonts.mock.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@t3-oss)/)' 
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/cypress/', 
    '<rootDir>/__tests__/Jamie/testenv/',
    '<rootDir>/cypress/',
    '<rootDir>/__tests__/*/mocks/'
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

module.exports = createJestConfig(customJestConfig)
