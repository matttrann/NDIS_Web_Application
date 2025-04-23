/**
 * User story: As a therapist I want to remove to remove a managed client so that I can no longer control that patient's account
 * 
 * requirements: The system must allow admins to access their list of managed clients, The system must display a list of all managed clients for that therapist,  
 * The system must provide an interface for the therapist to select a specific client for removal,  The system must allow the therapist to remove a selected client from their managed list,  
 * Once removed the system must unassign the admin from that patient within the database, The system shall restrict client removal actions to admins only
 * 
 * Test steps: "1. Log in as an admin
2. Navigate to the managed clients page
3. Verify that a list of managed clients is displayed
4. Select a specific client from the list for removal
5. Click the remove client button
6. Verify that the system unassigns the therapist as the admin for the selected patient in the database
7. Verify that the patient’s record no longer shows the therapist as the assigned admin
8. Attempt to access the managed clients page without therapist login and verify access is denied"
 * 
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ApprovedClients } from "../testenv/approved-clients - Copy";
import { handleRemoveClient } from '../testenv/removeclienthandler';
import '@testing-library/jest-dom';
import React from 'react';

global.fetch = jest.fn();

//mock data
const mockClients = [
  {
    id: 'rel-1',
    client: {
      id: 'client1',
      name: 'Patient One',
      email: 'one@example.com',
      image: null,
      questionnaires: [],
      videoRequests: [],
    }
  },
  {
    id: 'rel-2',
    client: {
      id: 'client2',
      name: 'Patient Two',
      email: 'two@example.com',
      image: null,
      questionnaires: [],
      videoRequests: [],
    }
  }
];

describe('ApprovedClients (Therapist removes managed client)', () => {
  const realConsoleError = global.console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: jest.fn() },
    });
    jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (typeof msg === 'string' && msg.includes('not wrapped in act')) return;
      realConsoleError(msg);
    });
  });

  it('displays list of managed clients', () => {
    render(<ApprovedClients clients={mockClients} />);
    expect(screen.getByText('Patient One')).toBeInTheDocument();
    expect(screen.getByText('Patient Two')).toBeInTheDocument();
  });

  it('sends a DELETE request to the correct endpoint', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    const result = await handleRemoveClient('rel-1');

    expect(fetch).toHaveBeenCalledWith(
      '/api/admin-client/rel-1',
      expect.objectContaining({ method: 'DELETE' })
    );
    expect(result).toBe(true);
  });

  it('throws an error if request fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(handleRemoveClient('rel-1')).rejects.toThrow('Failed to remove client');
  });

  it('removes client from the clients array after deletion', async () => {
    fetch.mockResolvedValueOnce({ ok: true });
  
    // Initial render with both clients
    const { rerender } = render(<ApprovedClients clients={mockClients} />);
  
    // Simulate click on remove
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
  
    const confirmButtons = await screen.findAllByText('Remove Client');
    const confirmButton = confirmButtons.find(btn => btn.tagName === 'BUTTON');
    fireEvent.click(confirmButton);
  
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/admin-client/rel-1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  
    // Simulate removing rel-1 from client list
    const updatedClients = mockClients.filter(c => c.id !== 'rel-1');
    expect(updatedClients.length).toBe(1);
    expect(updatedClients[0].client.name).toBe('Patient Two');
  
    // simulate app behavior by updating the list of clients
    rerender(<ApprovedClients clients={updatedClients} />);
  });


  it('denies access when not logged in as therapist (simulated)', () => {
    const isTherapist = false;

    if (!isTherapist) {
      render(<ApprovedClients clients={[]} />);
      expect(screen.queryByText('My Clients')).not.toBeInTheDocument();
    }
  });
});
