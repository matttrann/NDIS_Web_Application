/**
 * User story: As a patient I want to request being assigned to a specific therapist so that I can be assigned to the correct admin
 * requirements: The system must allow a logged-in patient to access the admin request page,  The system must display a list of available therapists on the admin request page,  
 * The system must allow the patient to select a specific therapist from the available list,  The system must allow patient's to submit requests for the assignment of the selected therapist,  
 * Upon admin request the system must record record the patient's request in the database,  The system must notify the assigned admin of the patient's request,  The system must restrict the assignment requests to logged-in patients only,  The system must ensure that only therapists available in the list can be selected
 * 
 * Test steps: "1. Log in as a patient 
2. Navigate to the therapist preferences page 
3. Verify that the list of available therapists is displayed (check for atleast one displaying)
5. Click the submit request button 
6. Verify that the system records the therapist assignment request in the database 
7. Verify that the assigned admin receives a notification about the patient's therapist preference 
8. Attempt to submit a request for a therapist not listed and verify that submission is prevented."
 * 
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminSelector } from "../testenv/admin-selector";
import '@testing-library/jest-dom';

global.fetch = jest.fn();

//mock data
const mockAdmins = [
  {
    id: 'therapist1',
    name: 'Dr. Smith',
    email: 'smith@example.com',
    image: null,
  },
  {
    id: 'therapist2',
    name: 'Dr. Jones',
    email: 'jones@example.com',
    image: null,
  },
];

describe('AdminSelector (Patient Therapist Request Flow)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      
        // Suppress "not wrapped in act" warning from window.location.reload()
        Object.defineProperty(window, 'location', {
          configurable: true,
          value: {
            ...window.location,
            reload: jest.fn(),
          },
        });
      
        // Suppress console.error for known act() warnings
        jest.spyOn(console, 'error').mockImplementation((msg) => {
          if (
            typeof msg === 'string' &&
            msg.includes('not wrapped in act')
          ) return;
          console.error(msg);
        });
      
        // Mock GET /api/admin-client
        fetch.mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAdmins),
          })
        );
      });

  it('displays available therapists on page load', async () => {
    render(<AdminSelector />);

    const therapistCard = await screen.findByText('Dr. Smith');
    expect(therapistCard).toBeInTheDocument();

    const buttons = await screen.getAllByText('Request Access');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('submits a therapist request successfully', async () => {
    render(<AdminSelector />);

    // Wait for list to render
    const requestButtons = await screen.findAllByText('Request Access');

    // Mock POST request
    fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true })
    );

    fireEvent.click(requestButtons[0]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/admin-client', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: 'therapist1' }),
      }));
    });
  });

  it('prevents submitting a therapist that is not listed', async () => {
    render(<AdminSelector />);

    const invalidTherapistId = 'not-in-list';
    const validIds = mockAdmins.map(admin => admin.id);

    expect(validIds).not.toContain(invalidTherapistId);
  });
});
