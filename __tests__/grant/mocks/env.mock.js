// Mock env.mjs for testing
module.exports = {
  env: {
    STRIPE_API_KEY: 'test_stripe_key',
    STRIPE_WEBHOOK_SECRET: 'test_webhook_secret',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: 'test_monthly_id',
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: 'test_yearly_id'
  }
}; 