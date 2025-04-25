/**
 * user story: As a Developer I want to configure subscription plans in Stripe and link them to the paywall, So that users can choose from available plans and subscribe accordingly.
 * Acceptance criteria: Given  I am setting up subscription plans, When I configure these plans in Stripe’s dashboard, Then I should ensure they are correctly linked to the paywall options in the app and reflect accurate pricing and billing cycles.
 * requirements: The system must have robust integration with stripe API, the system must retreive the stripe API paywall, the system must display a paywall in a pop-up element, the system must process payments via stripe API calls
 * 
 * test steps: 1. navigate to the paywall, 2. Verify that the paywall is displayed as a pop-up or modal element, 3. Confirm that the paywall retrieves and displays the correct Stripe plan details, 4. Click on a plan to subscribe and proceed to checkout, 5. Mock or simulate Stripe API payment call and validate that a subscription session is successfully initiated, 
 * 6. Ensure that Stripe returns a valid session ID or confirmation object, 7. Confirm redirection to Stripe-hosted checkout or completion of payment using test card credentials,  8. After payment, verify that the app updates the user’s subscription status appropriately,  
 * 
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock Paywall Component
function MockPaywall() {
  const [plans] = React.useState([
    { id: 'plan_basic', name: 'Basic Plan', price: '$0/month' },
    { id: 'plan_premium', name: 'Premium Plan', price: '$20/month' }
  ]);
  const [sessionId, setSessionId] = React.useState(null);

  const mockHandleSubscribe = async (planId) => {
    const response = await mockFetchStripeSession(planId);
    const data = await response.json();

    setSessionId(data.id);
    window.location.href = `https://mock.stripe.com/checkout/${data.id}`;
  };

  return (
    <div role="dialog" aria-label="Paywall Modal">
      <h2>Choose a Subscription Plan</h2>
      {plans.map(plan => (
        <div key={plan.id}>
          <p>{plan.name}</p>
          <p>{plan.price}</p>
          <button onClick={() => mockHandleSubscribe(plan.id)}>Subscribe</button>
        </div>
      ))}
    </div>
  );
}

// Mock fetch session creation to display plans
const mockFetchStripeSession = jest.fn(async (planId) => {
  return {
    json: async () => ({
      id: `mock_session_${planId}`
    })
  };
});

// Mock global fetch and window.location
global.fetch = jest.fn();
delete window.location;
window.location = { href: '' };

describe('Mocked Stripe Paywall Subscription Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchStripeSession.mockClear();
  });

  it('renders the paywall modal with mocked plans', async () => {
    render(<MockPaywall />);

    expect(screen.getByRole('dialog', { name: /paywall modal/i })).toBeInTheDocument();
    expect(screen.getByText('Basic Plan')).toBeInTheDocument();
    expect(screen.getByText('$0/month')).toBeInTheDocument();
    expect(screen.getByText('Premium Plan')).toBeInTheDocument();
    expect(screen.getByText('$20/month')).toBeInTheDocument();
  });

  it('mocks subscription flow and simulates Stripe redirect', async () => {
    render(<MockPaywall />);

    const subscribeButton = screen.getAllByText('Subscribe')[0];
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(mockFetchStripeSession).toHaveBeenCalledWith('plan_basic');
      expect(window.location.href).toBe('https://mock.stripe.com/checkout/mock_session_plan_basic');
    });
  });
});
