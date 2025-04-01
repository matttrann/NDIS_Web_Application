// Mock Auth
const mockAuth = jest.fn().mockResolvedValue({
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER'
  }
});

module.exports = {
  auth: mockAuth
}; 