// Mock environment variables for tests
module.exports = {
  env: {
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    NEXT_PUBLIC_VERCEL_URL: 'localhost:3000',
    AUTH_TRUST_HOST: 'true',
    DATABASE_URL: 'mock-db-url',
    NEXTAUTH_URL: 'http://localhost:3000',
    NEXTAUTH_SECRET: 'mock-secret',
    STRIPE_API_KEY: 'mock-stripe-key',
    STRIPE_WEBHOOK_SECRET: 'mock-webhook-secret',
    STRIPE_PRO_MONTHLY_PRICE_ID: 'price_mock_monthly',
    STRIPE_PRO_YEARLY_PRICE_ID: 'price_mock_yearly'
  }
}; 