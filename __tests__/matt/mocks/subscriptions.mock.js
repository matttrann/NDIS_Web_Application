// Mock subscriptions config
module.exports = {
  pricingData: [
    {
      name: "Starter",
      description: "For personal use",
      price: { monthly: "$0", yearly: "$0" },
      stripeIds: { monthly: null, yearly: null },
      features: ["Feature 1", "Feature 2"]
    },
    {
      name: "Pro",
      description: "For professional use",
      price: { monthly: "$20", yearly: "$200" },
      stripeIds: { monthly: "price_monthly_test", yearly: "price_yearly_test" },
      features: ["Pro Feature 1", "Pro Feature 2", "Pro Feature 3"]
    }
  ]
}; 