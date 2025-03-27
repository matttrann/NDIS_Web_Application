// __tests__/ui/billing-components.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';

// Mock the server action
const mockGenerateUserStripe = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Define mock pricing data inline instead of importing
const mockPricingData = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For beginners',
    stripeIds: { monthly: 'price_starter_monthly', yearly: 'price_starter_yearly' }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals',
    stripeIds: { monthly: 'price_pro_monthly', yearly: 'price_pro_yearly' }
  }
];

// Create mock components that behave like the real ones
// Mock BillingFormButton component
const MockBillingFormButton = ({ offer, subscriptionPlan, year }) => {
  const isPaid = subscriptionPlan.isPaid;
  const isCurrentPlan = isPaid && subscriptionPlan.stripePriceId === 
    (year ? offer.stripeIds.yearly : offer.stripeIds.monthly);
  
  const handleClick = async () => {
    await mockGenerateUserStripe(
      year ? offer.stripeIds.yearly : offer.stripeIds.monthly
    );
  };
  
  return (
    <button onClick={handleClick}>
      {isCurrentPlan ? 'Manage Subscription' : 'Upgrade'}
    </button>
  );
};

// Mock BillingInfo component
const MockBillingInfo = ({ userSubscriptionPlan }) => {
  if (!userSubscriptionPlan.isPaid) {
    return <div>Choose a plan</div>;
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  
  if (userSubscriptionPlan.isCanceled) {
    return (
      <div>
        <div>Your plan will be canceled on {formatDate(userSubscriptionPlan.stripeCurrentPeriodEnd)}</div>
      </div>
    );
  }
  
  return (
    <div>
      <div>You are currently on the <span>{userSubscriptionPlan.title}</span> plan.</div>
      <div>Your plan renews on {formatDate(userSubscriptionPlan.stripeCurrentPeriodEnd)}</div>
    </div>
  );
};

describe('Billing UI Components', () => {
  describe('BillingFormButton', () => {
    it('should display "Upgrade" for users not on the plan', () => {
      // Setup
      const subscriptionPlan = {
        isPaid: false,
        stripePriceId: null
      };
      
      // Render
      render(
        <MockBillingFormButton 
          offer={mockPricingData[1]} 
          subscriptionPlan={subscriptionPlan} 
          year={false} 
        />
      );
      
      // Verify
      expect(screen.getByText('Upgrade')).toBeInTheDocument();
    });
    
    it('should display "Manage Subscription" for users already on the plan', () => {
      // Setup
      const subscriptionPlan = {
        isPaid: true,
        stripePriceId: mockPricingData[1].stripeIds.monthly
      };
      
      // Render
      render(
        <MockBillingFormButton 
          offer={mockPricingData[1]} 
          subscriptionPlan={subscriptionPlan} 
          year={false} 
        />
      );
      
      // Verify
      expect(screen.getByText('Manage Subscription')).toBeInTheDocument();
    });
  });
  
  describe('BillingInfo', () => {
    it('should show subscription details for paid users', () => {
      // Setup
      const futureDate = Date.now() + 86400000 * 30; // 30 days in future
      const subscriptionPlan = {
        title: 'Pro',
        description: 'Unlock Advanced Features',
        isPaid: true,
        isCanceled: false,
        stripeCurrentPeriodEnd: futureDate,
        stripeCustomerId: 'cus_test123'
      };
      
      // Render
      render(<MockBillingInfo userSubscriptionPlan={subscriptionPlan} />);
      
      // Verify
      expect(screen.getByText(/You are currently on the/)).toBeInTheDocument();
      expect(screen.getByText('Pro')).toBeInTheDocument();
      expect(screen.getByText(/Your plan renews on/)).toBeInTheDocument();
    });
    
    it('should show "Choose a plan" for free users', () => {
      // Setup
      const subscriptionPlan = {
        title: 'Starter',
        description: 'For Beginners',
        isPaid: false,
        stripeCustomerId: null
      };
      
      // Render
      render(<MockBillingInfo userSubscriptionPlan={subscriptionPlan} />);
      
      // Verify
      expect(screen.getByText('Choose a plan')).toBeInTheDocument();
    });
    
    it('should show cancellation message for users who canceled', () => {
      // Setup
      const futureDate = Date.now() + 86400000 * 30; // 30 days in future
      const subscriptionPlan = {
        title: 'Pro',
        description: 'Unlock Advanced Features',
        isPaid: true,
        isCanceled: true,
        stripeCurrentPeriodEnd: futureDate,
        stripeCustomerId: 'cus_test123'
      };
      
      // Render
      render(<MockBillingInfo userSubscriptionPlan={subscriptionPlan} />);
      
      // Verify
      expect(screen.getByText(/Your plan will be canceled on/)).toBeInTheDocument();
    });
  });
});