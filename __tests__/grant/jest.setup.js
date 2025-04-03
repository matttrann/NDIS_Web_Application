// Mock the modules
jest.mock('@/env.mjs', () => require('./mocks/env.mock.js'));
// Subscription mock removed as we're not testing subscription functionality in Grant's tests 