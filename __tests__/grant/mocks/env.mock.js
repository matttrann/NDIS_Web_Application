// Mock env.mjs for testing
module.exports = {
  env: {
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000'
    // Stripe-related variables removed as they're not needed for avatar selection and API integration tests
  }
}; 