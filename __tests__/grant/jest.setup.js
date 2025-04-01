// Mock the modules
jest.mock('@/env.mjs', () => require('./mocks/env.mock.js'));
jest.mock('@/config/subscriptions', () => require('./mocks/subscriptions.mock.js')); 