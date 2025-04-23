// Mock Stripe module for testing
module.exports = {
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn()
      }
    },
    billingPortal: {
      sessions: {
        create: jest.fn()
      }
    },
    subscriptions: {
      retrieve: jest.fn()
    },
    webhooks: {
      constructEvent: jest.fn()
    }
  }
}; 