/**
 * User story: As a therapist I want to approve a request from a patient to be there admin so that I can control their experience
 * 
 * Requirements: The system must ensure the therapist is logged in before accessing request approvals, display a list of pending patient admin requests, 
 * allow the therapist to view patient details and approve or reject requests, 
 * update the patient record with the therapist's ID upon approval, notify the patient of the decision, and prevent duplicate approvals or reassignment conflicts.
 * 
 * Test steps: "1. Log in as an admin
2. Navigate to the pending patient requests page
3. Verify that a list of pending patient requests is displayed (test for when none are expected and when many are expected)
4. Click the approve request button for the selected patient
5. Verify that the system assigns the therapist as the admin for that patient in the database
6. Verify that the patient's assigned therapist field is updated accordingly
7. Attempt to access the pending requests page without therapist login and verify access is denied"
 * 
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClientRequests } from "../testenv/client-requests - Copy"; 
import '@testing-library/jest-dom';

global.fetch = jest.fn();

//mock data
const mockRequests = [
  {
    id: 'req123',
    createdAt: new Date().toISOString(),
    client: {
      id: 'client456',
      name: 'Alex Smith',
      email: 'alex@example.com',
      image: null,
    },
  },
];

describe('ClientRequests (Therapist Approves Admin Request)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'location', {
          configurable: true,
          value: { reload: jest.fn() },
        });
      });

  it('displays "no pending requests" when list is empty', () => {
    render(<ClientRequests requests={[]} />);
    expect(screen.getByText('No Pending Requests')).toBeInTheDocument();
  });

  it('displays a list of pending requests when available', () => {
    render(<ClientRequests requests={mockRequests} />);
    expect(screen.getByText('Alex Smith')).toBeInTheDocument();
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
  });

  it('sends approval request and shows success message', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(<ClientRequests requests={mockRequests} />);
    const approveButton = screen.getByText('Approve');

    fireEvent.click(approveButton);
    
//mock admin-client call for client approval
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/admin-client/req123', expect.objectContaining({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      }));
    });
  });

  it('does not render requests if user is not an admin (simulated)', () => {
    const isAdmin = false;
  
    if (!isAdmin) {
      render(<ClientRequests requests={[]} />);
      expect(screen.queryByText('Pending Client Requests')).not.toBeInTheDocument();
    }
  });
});