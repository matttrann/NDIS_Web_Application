// Mock Auth module
module.exports = {
  auth: jest.fn().mockResolvedValue({
    user: { id: 'test-user-id', email: 'test@example.com' }
  })
};