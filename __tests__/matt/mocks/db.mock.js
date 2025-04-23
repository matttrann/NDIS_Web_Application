// Mock DB module
module.exports = {
  prisma: {
    user: {
      findFirst: jest.fn(),
      update: jest.fn()
    }
  }
}; 