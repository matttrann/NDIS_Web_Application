// Mock Prisma client
module.exports = {
  prisma: {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    },
    subscriptionPlan: {
      findFirst: jest.fn(),
      findMany: jest.fn()
    }
  }
}; 